<template>
    <div class="marking" v-if="recordId.length < 1">
  
      <a-row style="margin-bottom: 16px;">
        <a-space>
          <a-select v-model:value="state.queryInfo.examId" placeholder="请选择考试" style="width: 200px; text-align: left;" allowClear>
            <a-select-option v-for="(item, index) in state.examOptions" :key="index" :value="parseInt(item.examId)">
              {{ item.examName }}
            </a-select-option>
          </a-select>
          <a-button :icon="h(SearchOutlined)" @click="getList" type="primary" />
        </a-space>
      </a-row>
      <a-table :columns="columns"
        :row-key="(record: any) => record.recordId" :data-source="dataSource" :pagination="pagination"
        @change="handleTableChange" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.totalScore === null ? 'yellow' : 'green'">
                {{ record.totalScore === null ? '未批阅' : '已批阅' }}
              </a-tag>
          </template>
          <template v-else-if="column.key === 'totalScore'">
            <span>
                {{ record.totalScore === null ? '-' : record.totalScore }}
            </span>
          </template>
          <template v-else-if="column.key === 'id'">
            <a-button type="link" @click="handleDetail(record)" :disabled="record.totalScore !== null">去批阅</a-button>
          </template>
        </template>
      </a-table>
    </div>
    <MarkingDetail v-else :recordId="recordId" @back="handleBack" />
  </template>
  
  <script setup lang="ts">
  import { reactive, computed, h, onMounted, ref } from 'vue';
  import request from '../../service/request';
  import API from '../../api/api'
  import { TableProps } from 'ant-design-vue';
  import { usePagination } from 'vue-request';
  import { SearchOutlined } from '@ant-design/icons-vue';
  // import router from '../../router';
  import MarkingDetail from './MarkingDetail.vue';

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
  const columns = [
    {
      title: '考试名称',
      dataIndex: 'examName',
      key: 'examName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '考试时间',
      dataIndex: 'examTime',
      key: 'examTime',
      width: 220,
    },
    {
      title: '考生',
      dataIndex: 'username',
      key: 'username',
      width: 180,
      ellipsis: true,
    },
    {
      title: '客观题得分',
      dataIndex: 'logicScore',
      key: 'logicScore',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
  ]
  const recordId = ref('')
  const state = reactive({
    queryInfo: {
      examId: '',
      pageNo: 1,
      pageSize: 10,
    },
    examOptions: [] as ExamOptiontype[]
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
  } = usePagination(queryData, {
    pagination: {
      currentKey: 'pageNo',
      pageSizeKey: 'pageSize',
    },
  });
  
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
  
  const handleDetail = (record: any) => {
    console.log(record)
    recordId.value = record.recordId
  }

  const handleBack = (type: "cancel" | "ok", _newVisible: boolean) => {
    recordId.value = ''
    if (type === "ok") {
      getList()
    }
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
  .marking {
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
  