<template>
  <div class="task-list">

    <a-row style="margin-top: 16px;">
      <a-space style="margin-bottom: 16px;">
        <a-select v-model:value="state.queryInfo.examType" placeholder="请选择考试类型" style="width: 200px; text-align: left;"
          allowClear>
          <a-select-option v-for="(item, index) in examTypeOptions" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-input v-model="state.queryInfo.examName" placeholder="请输入考试名称"></a-input>
        <a-button :icon="h(SearchOutlined)" @click="getList" type="primary" />
      </a-space>
    </a-row>
    <a-table :columns="columns" :row-key="(record: any) => record.id" :data-source="dataSource" :pagination="pagination"
      @change="handleTableChange" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <span>
            {{ record.type === 1 ? '需要密码' : '完全公开' }}
          </span>
        </template>
        <template v-else-if="column.key === 'examTime'">
          <span>
            {{ record.startTime === null ? '-' : record.startTime + '~' + record.endTime }}
          </span>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-button type="link" @click="handleExam(record)" :disabled="!record.acceptExam">
            {{ record.acceptExam ? '去考试' : '暂不开放' }}
          </a-button>
        </template>
      </template>
    </a-table>
    <a-modal title="考试密码" v-model:open="state.psdVisble" width="45%" @cancel="handlePsdCancel" @ok="handlePsdOk"
            cancelText="取消" okText="确定">

            <a-form :model="psdForm" ref="psdFormRef" :rules="psdFormRules" @finish="handlePsdFinish"
                @finishFailed="handlePsdFinishFailed" v-bind="layout">
                <a-form-item label="考试密码" label-width="120px" prop="password">
                    <a-input v-model:value="psdForm.password" placeholder="请输入考试进场密码"></a-input>
                </a-form-item>

            </a-form>
        </a-modal>
    <a-modal title="考试提示" v-model:open="state.examVisible" width="45%" @cancel="handleExamCancel" @ok="handleExamOk"
      cancelText="返回" okText="开始考试">
      <a-alert message="点击`开始考试`后将自动进入考试，请诚信考试，考试过程中可能会对用户行为、用户视频进行截图采样，请知悉！" type="error" />
      <a-descriptions :column="1" style="padding: 16px; margin: 24px 0;box-shadow: 10px 10px 50px #E1E2E5,10px 15px 50px #E9EFFC;">
        <a-descriptions-item label="考试名称">{{ state.currentExam?.examName }}</a-descriptions-item>
        <a-descriptions-item label="考试描述">{{ state.currentExam?.description }}</a-descriptions-item>
        <a-descriptions-item label="考试时长">{{ state.currentExam?.duration }}分钟</a-descriptions-item>
        <a-descriptions-item label="试卷总分">{{  state.currentExam?.totalScore }}分</a-descriptions-item>
        <a-descriptions-item label="及格分数">{{ state.currentExam?.passScore }}分
        </a-descriptions-item>
        <a-descriptions-item label="考试类型">{{ state.currentExam?.type === 1 ? '需要密码' : '完全公开' }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>

</template>

<script setup lang="ts">
import { reactive, computed, h, ref } from 'vue';
import request from '../../service/request';
import API from '../../api/api'
import { TableProps, message } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

type APIParams = {
  examName?: string,
  examType?: string,
  startTime?: string,
  endTime?: string,
  pageNo?: number,
  pageSize?: number,
  [key: string]: any;
};
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
}
//题目类型
const examTypeOptions = [
  {
    id: 1,
    name: '公开考试',
  },
  {
    id: 2,
    name: '需要密码',
  }
]
const columns = [
  {
    title: '考试名称',
    dataIndex: 'examName',
    key: 'examName',
    ellipsis: true,
  },
  {
    title: '考试时间',
    dataIndex: ' examTime',
    key: 'examTime',
    width: 250,
  },
  {
    title: '考试类型',
    dataIndex: 'type',
    key: 'type',
    width: 160,
  },
  {
    title: '时长（分钟）',
    dataIndex: 'duration',
    key: 'duration',
    width: 150,
  },
  {
    title: '总分',
    dataIndex: 'totalScore',
    key: 'totalScore',
    width: 120,
  },
  {
    title: '及格线',
    dataIndex: 'passScore',
    key: 'passScore',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 140,
  }
]
const psdFormRules = reactive({
    bankName: [
        { required: true, message: '请输入考试进场密码', trigger: 'blur' }
    ]
})
const router = useRouter()
const psdFormRef = ref();

const state = reactive({
  queryInfo: {
    examType: '',
    examName: '',
    pageNo: 1,
    pageSize: 10,
  },
  data: [],
  total: 0,
  examVisible: false,
  psdVisble: false,
  currentExam: {} as {[key: string]: any}
});
const psdForm = reactive({
    password: '',

});
const getList = async () => {
  try {
    const res = await run(state.queryInfo);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const queryData = (params: APIParams) => {
  const queryParams = {
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 10,
    examName: params.examName ?? null,
    examType: params.examName ?? null
  }
  return request("POST", API.teacher.getExamInfo, queryParams);
};
const {
  data,
  run,
  loading,
  current,
  pageSize,
} = usePagination(queryData, {
  pagination: {
    currentKey: 'pageNo',
    pageSizeKey: 'pageSize',
  },
});

const checkExam = (row: { status: number; startTime: string | number | Date; endTime: string | number | Date; }) => {
  let date = new Date();
  if (row.status === 2) {
    return false
  }
  if (row.startTime === null && row.endTime === null) {
    return true
  } else if (row.startTime === null) {
    return date < new Date(row.endTime)
  } else if (row.endTime === null) {
    return date > new Date(row.startTime)
  } else if (date > new Date(row.startTime) && date < new Date(row.endTime)) {
    return true
  }
}
const dataSource = computed(() => {
  return (data?.value?.data ?? []).map((i: { startTime: string; endTime: string; status: number }) => {
    return {
      ...i,
      examTime: i.startTime === null ? '' : i.startTime + '~' + i.endTime,
      acceptExam: checkExam(i)
    }
  })
});

const pagination = computed(() => ({
  showTotal: (total: any) => `共${total}条数据`,
  total: (data as unknown as [])?.length,
  showSizeChanger: true,
  current: current.value,
  pageSize: pageSize.value,
  pageSizeOptions: [
    '10',
    '20',
    '30',
    '50',
  ],
}));
const handleTableChange: TableProps['onChange'] = (
  pag,
  filters: any,
) => {
  state.queryInfo = {
    ...state.queryInfo,
    ...pag,
  };
  run({
    pageNo: pag.current,
    pageSize: pag.pageSize,
    ...filters,
  });
};
const handleExam = (record: any) => {
  console.log(record);
  state.currentExam = record
  if (record.type === 1) {
    state.psdVisble = true
  } else {
    state.examVisible = true
  }
}
const handlePsdOk = () => {
  psdFormRef.value.validate().then(handlePsdFinish).catch(handlePsdFinishFailed)
}
const handlePsdFinish = () => {
  if (Object.keys(state.currentExam).length > 0) {
    if (state.currentExam.type === 1 && state.currentExam.password === psdForm.password) {
      state.psdVisble = false
      state.examVisible = true
    } else {
      message.warning('密码错误o(╥﹏╥)o')
    }
  }
}
const handlePsdFinishFailed = (error: any) => {
    console.log('Failed:', error);
    message.warning('请检查您所填写的信息是否有误');
}
//表单信息重置
const handlePsdCancel = () => {
  psdFormRef.value.resetFields();
  state.psdVisble = false
}
const handleExamCancel = () => {
  state.examVisible = false
}
const handleExamOk = () => {
  state.examVisible = false
  if (Object.keys(state.currentExam).length > 0) {
    router.push({ path: '/onlineExam' + '/' + state.currentExam.examId })
  }
}
</script>


<style>
.task-list {
  animation: leftMoveIn .7s ease-in;
  padding: 16px 24px;
}

@keyframes leftMoveIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
</style>
