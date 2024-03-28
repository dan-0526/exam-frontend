<template>
  <div class="question-bank">

    <a-row style="margin-top: 16px;">
      <a-space>
        <a-select v-model:value="state.queryInfo.questionType" placeholder="请选择题目类型" style="width: 200px; text-align: left;" allowClear>
          <a-select-option v-for="(item) in questionTypeOptions" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-select v-model:value="state.queryInfo.questionBank" placeholder="请选择科目" style="width: 200px;text-align: left;" allowClear>
          <a-select-option v-for="(item) in subjectList" :key="item.bankId" :value="item.bankName">
            {{ item.bankName }}
          </a-select-option>
        </a-select>
        <a-input v-model="state.queryInfo.questionContent" placeholder="请输入题目内容"></a-input>
        <a-button :icon="h(SearchOutlined)" @click="getList" type="primary" />
      </a-space>
    </a-row>
    <a-row style="margin: 16px 0;">
      <a-space>
        <a-button type="primary" @click="showAddDialog">
          添加
        </a-button>
        <a-button @click="handleDelete" :disabled="state.selectedRowKeys.length === 0">
                    删除
                </a-button>
      </a-space>
    </a-row>

    <a-table :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :columns="columns"
      :row-key="(record: any) => record.id" :data-source="dataSource" :pagination="pagination"
      @change="handleTableChange" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'quType'">
          <span>{{ questionTypeArr[record.quType] }}</span>
        </template>
        <template v-if="column.key === 'level'">
          <span>{{ levelArr[record.level] }}</span>
        </template>
      </template>
    </a-table>
    <a-modal title="添加题目" v-model:open="addVisible" width="45%" @cancel="resetAddForm" @ok="handleOk" cancelText="取消" centered bodyStyle="height: 72vh; overflow-y: auto;"
      okText="确定">

      <a-form :model="addForm" :rules="addFormRules" ref="addFormRef" @finish="addQuestion" @finishFailed="addQuestionFailed"
        v-bind="layout">

        <a-form-item label="题目类型" prop="questionType">
          <a-select v-model:value="addForm.questionType" placeholder="请选择题目类型">
            <a-select-option v-for="(item) in questionTypeOptions" :key="item.id" :value="Number(item.id)">
            {{ item.name }}
          </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="难度等级" prop="questionLevel">
          <a-select v-model:value="addForm.questionLevel" placeholder="请选择难度等级">
            <a-select-option :value="Number(1)">简单</a-select-option>
            <a-select-option :value="Number(2)">中等</a-select-option>
            <a-select-option :value="Number(3)">困难</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所属科目" prop="bankId">
          <a-select v-model:value="addForm.bankId" placeholder="请选择题目类型" mode="multiple">
            <a-select-option v-for="(item) in subjectList" :key="item.bankId" :value="item.bankId">
              {{ item.bankName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="题目内容" prop="questionContent">
          <a-textarea v-model:value="addForm.questionContent" :row="3"></a-textarea>
        </a-form-item>
        <a-form-item label="题目图片" prop="images">
          <a-input v-model:value="addForm.images"></a-input>
        </a-form-item>
        <a-form-item label="整题解析" prop="analysis">
          <a-textarea v-model:value="addForm.analysis" :row="3"></a-textarea>
        </a-form-item>
        <a-button v-if="addForm.questionType !== 4" type="primary"size="small" @click="handleAddAnswer" style="margin-left: 5%; margin-bottom: 16px">
          添加
        </a-button>

        <!--存放答案表单的信息-->
        <a-form-item prop="answer" v-if="addForm.questionType !== 4" :wrapper-col="{ span: 23, offset: 1 }">
          <a-table :row-key="(record: any) => record.id" :data-source="addForm.answer" :columns="answerColumns">

            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'isTrue'">
                <a-checkbox v-model="record.isTrue" @change="(checked: any) => checkUpdateAnswer(checked, record.id)">答案
                </a-checkbox>
              </template>
              <template v-else-if="column.dataIndex === 'images'">
                <a-upload id="answerUpload" :max-count="1" action="http://127.0.0.1:9991/teacher/uploadQuestionImage"
                  :preview="onPreview" :headers="headers" :before-upload="beforeUpload" list-type="picture"
                  :change="handleChange" name="file">
                  <a-button size="small" type="primary">点击上传</a-button>
                </a-upload>
              </template>
              <template v-else-if="column.dataIndex === 'operation'">
                <a-button danger shape="circle" @click="delUpdateAnswer(record.id)" :icon="h(DeleteOutlined)"></a-button>
              </template>
              <template v-else>
                <a-input v-model:value="record[column.dataIndex]"></a-input>
              </template>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>

</template>

<script setup lang="ts">
import { ref, reactive, computed, h, createVNode, onMounted } from 'vue';
import request from '../../service/request';
import API from '../../api/api'
import { Modal, TableProps, UploadChangeParam, message } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { Res } from '../../api/type';
import { ExclamationCircleOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue';
type APIParams = {
  questionType?: string,
  questionContent?: string,
  questionBank?: string,
  pageNo?: number,
  pageSize?: number,
  [key: string]: any;
};
type AnswerType = {
  id: number;
  isTrue: boolean;
  answer: string;
  images: [];
  analysis: string;
}
const questionTypeArr = ["未知", "单选题", "多选题", "判断题", "简答题"];
const levelArr = ["未知", "简单", "中等", "困难"]
//题目类型
const questionTypeOptions = [
  {
    id: 1,
    name: '单选题',
  },
  {
    id: 2,
    name: '多选题',
  },
  {
    id: 3,
    name: '判断题',
  },
  {
    id: 4,
    name: '简答题',
  },
]
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const columns = [
  {
    title: '题目类型',
    dataIndex: 'quType',
    key: 'quType',
    width: 120,
  },
  {
    title: '题目内容',
    dataIndex: 'quContent',
    key: 'quContent',
    ellipsis: true,
  },
  {
    title: '难度',
    dataIndex: 'level',
    key: 'level',
    width: 120,
  },
  {
    title: '所属科目',
    dataIndex: 'quBankName',
    key: 'quBankName',
    ellipsis: true,
  },
  {
    title: '创建人',
    dataIndex: 'createPerson',
    key: 'createPerson',
    width: 120,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
]
const answerColumns = [
  {
    title: '是否答案',
    dataIndex: 'isTrue',
    key: 'isTrue',
    width: 120,
  },
  {
    title: '选项图片',
    dataIndex: 'images',
    key: 'images',
    width: 120,
  },
  {
    title: '选项内容',
    dataIndex: 'answer',
    key: 'answer',
    width: 120,
  },
  {
    title: '选项解析',
    dataIndex: 'analysis',
    key: 'analysis',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  }
]

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

const state = reactive({
  queryInfo: {
    questionType: '',
    questionContent: '',
    questionBank: '',
    pageNo: 1,
    pageSize: 10,
  },
  data: [],
  total: 0,
  selectedRowKeys: []
});

const addFormRules = reactive({
  questionType: [
    {
      required: true,
      message: '请选择问题类型',
      trigger: 'blur'
    }
  ],
  questionLevel: [
    {
      required: true,
      message: '请选择问题难度',
      trigger: 'blur'
    }
  ],
  bankId: [
    {
      required: true,
      message: '请选择题库',
      trigger: 'blur'
    }
  ],
  questionContent: [
    {
      required: true,
      message: '请输入题库内容',
      trigger: 'blur'
    }
  ],
})
const addForm = reactive({
  questionType: 1,
  questionLevel: 1,
  bankId: "",
  questionContent: '',
  images: [],
  analysis: '',
  createPerson: localStorage.getItem('username'),
  //答案对象
  answer: [] as AnswerType[]
});
const addFormRef = ref();
const addVisible = ref(false);
const subjectList = ref<{ bankId: string, bankName: string }[]>([]);
const previewImgVisible = ref(false);
const previewImgUrl = ref('');


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
    questionType: params.questionType ?? '',
    questionContent: params.questionContent ?? '',
    questionBank: params.questionBank ??'',
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 10,
  }
  // const queryParams = Object.assign({}, toRaw(defaultParams), toRaw(params));
  return request("GET", API.teacher.getQuestion, queryParams);
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
const headers = computed(() => {
  return {
    authorization: localStorage.getItem('authorization') || ''
  }
})

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

const getSubjects = () => {
  request("GET", API.teacher.getQuestionBank).then((res: Res<any>) => {
    if (res.code === 200) {
      subjectList.value = res.data
    }
  })
}
onMounted(() => {
  getSubjects()
})
const handleDelete = () => {
    Modal.confirm({
        title: '删除题目',
        icon: createVNode(ExclamationCircleOutlined),
        content: '此操作将永久删除该题目, 是否继续？',
        okText: '确认',
        okType: 'danger',
        okButtonProps: {
            disabled: true,
        },
        cancelText: '取消',
        onOk() {
            request("GET", API.teacher.deleteQuestion, { 'questionIds': state.selectedRowKeys.join(',') }).then((res: Res<string>) => {
                if (res.code === 200) {
                    //删除成功后,回调更新用户数据
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
const showAddDialog = () => {
  addVisible.value = true
}
const handleAddAnswer = () => {
  addForm.answer.push({
    id: addForm.answer.length,
    isTrue: false,
    answer: '',
    images: [],
    analysis: ''
  })
}
const onPreview = (file: { response: { data: string; }; }) => {
  previewImgVisible.value = true;
  previewImgUrl.value = file.response.data
}
const beforeUpload = (file: { type: string; size: number; }) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传图片类型文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done' && info.file.originFileObj !== undefined) {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      console.log(base64Url);
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('upload error');
  }
};
//更新时选择正确答案的按钮变化事件
const checkUpdateAnswer = (checked: any, id: number) => {
  if (checked) {
    if (addForm.questionType === 1 || addForm.questionType === 3) {//单选或者判断
      //当前已经有一个正确的选择了
      addForm.answer.map(item => {
        item.isTrue = false
      })
      addForm.answer.map(item => {
        if (item.id === id) item.isTrue = true
      })
    } else {//多选 可以有多个答案
      addForm.answer.map(item => {
        if (item.id === id) item.isTrue = true
      })
    }
  } else {
    addForm.answer.map(item => {
      if (item.id === id) item.isTrue = false
    })
  }
}

const delUpdateAnswer = (id: number) => {//当前答案的id
  addForm.answer.map((item, index) => {
    if (item.id === id) {
      addForm.answer.splice(index, 1)
    }
  })
}
//添加用户
const addQuestion = () => {
  if (!addForm.answer.some(item => item.isTrue)) {
    message.warning('请选择正确答案')
    return
  }
  const addParams = {
    ...addForm,
    answer: addForm.questionType === 4 ? [] : addForm.answer
  }
  request("POST", API.teacher.addQuestion, addParams).then((resp: Res<any[]>) => {
    if (resp.code === 200) {
      getList()
      message.success(resp.message)
    } else {
      message.error(resp.message)
    }
    addVisible.value = false
  })
}
const handleOk = () => {
  console.log('addForm', addForm);
  addFormRef.value.validate().then(addQuestion).catch(addQuestionFailed)
}
const addQuestionFailed = (error: any) => {
  console.log('Failed:', error);
  message.warning('请检查您所填写的信息是否有误');
}
//表单信息重置
const resetAddForm = () => {
  addFormRef.value.resetFields();
  addVisible.value = false
}
</script>


<style>
.question-bank {
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
