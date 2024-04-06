<template>
  <div class="exam-records">

    <a-row style="margin-top: 16px;">
      <a-space>
        <a-select v-model:value="state.queryInfo.examId" placeholder="请选择考试" style="width: 200px; text-align: left;" allowClear>
          <a-select-option v-for="(item, index) in state.examOptions" :key="index" :value="parseInt(item.examId)">
            {{ item.examName }}
          </a-select-option>
        </a-select>
        <a-button :icon="h(SearchOutlined)" @click="getList" type="primary" />
      </a-space>
    </a-row>
    <a-table :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :columns="columns"
      :row-key="(record: any) => record.recordId" :data-source="dataSource" :pagination="pagination"
      @change="handleTableChange" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'passStatus'">
          <a-tag :color="passScoreArr[record.passStatus + 1].color">
              {{ passScoreArr[record.passStatus + 1].title}}
            </a-tag>
        </template>
        <template v-else-if="column.key === 'totalScore'">
          <span>
              {{ record.totalScore === null ? '-' : record.totalScore }}
          </span>
        </template>
      </template>
    </a-table>


  </div>

</template>

<script setup lang="ts">
import { reactive, computed, h, onMounted } from 'vue';
import request from '../../service/request';
import API from '../../api/api'
import { TableProps } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { SearchOutlined } from '@ant-design/icons-vue';
import { Res } from '../../api/type';

type APIParams = {
  examId?: string,
  pageNo?: number,
  pageSize?: number,
  [key: string]: any;
};
type ExamOptiontype = {
  examId: string,
  examName: string,
}
// const layout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 16 },
// }
const passScoreArr = [
  {
    color: "gray",
    title: "未知"
  },
  {
    color: "yellow",
    title: "待批阅"
  },
  {
    color: "red",
    title: "不及格"
  },
  {
    color: "green",
    title: "及格"
  }
]
const columns = [
  {
    title: '考试名称',
    dataIndex: 'examName',
    key: 'examName',
    width: "20%",
    ellipsis: true,
  },
  {
    title: '考试时间',
    dataIndex: 'examTime',
    key: 'examTime',
    width: 250,
  },
  {
    title: '考生',
    dataIndex: 'username',
    key: 'username',
    ellipsis: true,
  },
  {
    title: '客观题得分',
    dataIndex: 'logicScore',
    key: 'logicScore',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'passStatus',
    key: 'passStatus',
    width: 150
  },
  {
    title: '总分',
    dataIndex: 'totalScore',
    key: 'totalScore',
    width: 120,
  }
]

const state = reactive({
  queryInfo: {
    examId: '',
    pageNo: 1,
    pageSize: 10,
  },
  data: [] as any[],
  total: 0,
  selectedRowKeys: [],
  examOptions: [] as ExamOptiontype[]
});


const getList = async () => {
  try {
    const res = await run(state.queryInfo) as unknown as Res<{data: any[];total: number}>;
    console.log(res);
    state.data = res.data?.data;
    state.total = res.data?.total;
  } catch (error) {
    console.log(error);
  }
};

const queryData = (params: APIParams) => {
  const queryParams = {
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 10,
  }
  return request("GET", API.teacher.getExamRecord, queryParams);
};
const {
  data,
  run,
  total,
  loading,
  current,
  pageSize,
  ...other
} = usePagination(queryData, {
  pagination: {
    currentKey: 'pageNo',
    pageSizeKey: 'pageSize',
  },
});
console.log(data,
  run,
  total,
  loading,
  current,
  pageSize, other)
const dataSource = computed(() => data?.value?.data.data || []);

const pagination = computed(() => ({
  showTotal: (total: any) => `共${total}条数据`,
  total: total,
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

const getExamList = async () => {
  try {
    const res = await request("GET", API.teacher.allExamInfo, {});
    console.log(res);
    state.examOptions = res.data;
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  getExamList();
})
</script>


<style>
.exam-records {
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
