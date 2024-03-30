<template>
  <div class="exam-paper">

    <a-row style="margin-top: 16px;">
      <a-space>
        <a-select v-model:value="state.queryInfo.examType" placeholder="请选择考试类型" style="width: 200px; text-align: left;" allowClear>
          <a-select-option v-for="(item) in examTypeOptions" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-input v-model="state.queryInfo.examName" placeholder="请输入考试名称"></a-input>
        <a-button :icon="h(SearchOutlined)" @click="getList" type="primary" />
      </a-space>
    </a-row>
    <a-row style="margin: 16px 0;">
      <a-space>
      <a-button type="primary" @click="handleAdd">
        添加
      </a-button>
      <a-button @click="handleChange('on')" :disabled="state.selectedRowKeys.length === 0">
        启用
      </a-button>
      <a-button @click="handleChange('off')" :disabled="state.selectedRowKeys.length === 0">
        禁用
      </a-button>
      <a-button @click="handleChange('delete')" :disabled="state.selectedRowKeys.length === 0">
        删除
      </a-button>
    </a-space>
    </a-row>
    <a-table :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :columns="columns"
      :row-key="(record: any) => record.id" :data-source="dataSource" :pagination="pagination"
      @change="handleTableChange" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'examName'">
          <a-button type="link" @click="handleDetail(record)">{{ record.examName  }}</a-button>
        </template>
        <template v-else-if="column.key === 'time'">
          <span>{{ record.startTime !== null ? record.startTime + ' - ' + record.endTime : '-' }}</span>
        </template>
        <template v-else-if="column.key === 'type'">
          <span>{{ record.type === 1 ? '公开考试' : '需要密码' }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            <a-tag :color="record.status === 1 ? 'green' : 'gray'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </span>
        </template>
      </template>
    </a-table>


  </div>

</template>

<script setup lang="ts">
import { reactive, computed, h, createVNode } from 'vue';
import request from '../../service/request';
import API from '../../api/api'
import { Modal, TableProps, message } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { Res } from '../../api/type';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import router from '../../router';

type APIParams = {
  examType?: string,
  examName?: string,
  startTime?: string,
  endTime?: string,
  pageNo?: number,
  pageSize?: number,
  [key: string]: any;
};


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
// const layout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 16 },
// }
const columns = [
  {
    title: '考试名称',
    dataIndex: 'examName',
    key: 'examName',
    ellipsis: true,
  },
  {
    title: '考试类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: '考试时间',
    dataIndex: ' time',
    key: 'time',
    width: 240,
  },
  {
    title: '试卷总分',
    dataIndex: 'totalScore',
    key: 'totalScore',
    ellipsis: true,
    width: 120,
  },
  {
    title: '及格分数',
    dataIndex: 'passScore',
    key: 'passScore',
    width: 120,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
  },
]



const state = reactive({
  queryInfo: {
    examType: '',
    startTime: '',
    endTime: '',
    examName: '',
    pageNo: 1,
    pageSize: 10,
  },
  data: [],
  total: 0,
  selectedRowKeys: []
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
    examType: params.examType ?? null,
    startTime: params.startTime ?? null,
    endTime: params.endTime ?? null,
    examName: params.examName ?? null,
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 10,
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

const dataSource = computed(() => data?.value?.data || []);

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
const onSelectChange = (val: never[]) => {
  console.log(val);
  state.selectedRowKeys = val
}

const handleChange = (val: "on" | "off" | "delete") => {
  //清空上一次的操作
  const oprations = {
    on: { title: '启用', index: 1},
    off: { title: '禁用', index: 2},
    delete: { title: '删除', index: 3},
  }

    Modal.confirm({
        title: oprations[val].title + '题目',
        icon: createVNode(ExclamationCircleOutlined),
        content: `确认批量${oprations[val].title}题目吗？`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          request("GET", API.teacher.operationExam + '/' + oprations[val].index, { 'ids': state.selectedRowKeys.join(',') }).then((res: Res<string>) => {
            if (res.code === 200) {
              getList()
              message.success(res.message)
              state.selectedRowKeys = [];
            } else {
              message.error(res.message)
            }
          })
        },
        onCancel() {

        },
    });
}
//点击添加按钮
const handleAdd = () => {
  router.push('/addPaPer')
}
const handleDetail = (record: any) => {
  console.log(record)
  router.push('/updatePaPer')
}
</script>


<style>
.exam-paper {
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
