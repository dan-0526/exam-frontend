<template>
    <div class="subjects">

        <a-row>
            <a-col span="6">
                <a-input-search v-model="state.queryInfo.bankName" @search="getList" placeholder="搜索题库名" maxlength="50" allowClear></a-input-search>

            </a-col>
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

        <a-table :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            :columns="columns" :row-key="(record: any) => record.id" :data-source="dataSource" :pagination="pagination"
            @change="handleTableChange" :loading="loading">
            <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'questionBank'">
          <span>{{ record.questionBank.bankName }}</span>
        </template>
      </template>
        </a-table>
        <a-modal title="添加科目" v-model:open="addVisible" width="45%" @cancel="resetAddForm" @ok="handleOk"
            cancelText="取消" okText="确定">

            <a-form :model="addForm" :rules="addFormRules" ref="addFormRef" @finish="addSubject"
                @finishFailed="addSubjectFailed" v-bind="layout">
                <a-form-item label="科目名称" label-width="120px" prop="bankName">
                    <a-input v-model:value="addForm.bankName"></a-input>
                </a-form-item>

            </a-form>
        </a-modal>

    </div>

</template>

<script setup lang="ts">
import { ref, reactive, computed, toRaw, createVNode } from 'vue';
import request from '../../service/request';
import API from '../../api/api'
import { Modal, TableProps, message } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { Res } from '../../api/type';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
type APIParams = {
    loginName?: string,
    [key: string]: any;
}
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
}
const columns = [
    {
        title: '科目名称',
        dataIndex: 'questionBank',
        key: 'questionBank',
        width: 200,
        ellipsis: true,
    },
    {
        title: '单选题',
        dataIndex: 'singleChoice',
        key: 'singleChoice',
    },
    {
        title: '多选题',
        dataIndex: 'multipleChoice',
        key: 'multipleChoice',
    },
    {
        title: '判断题',
        dataIndex: 'judge',
        key: 'judge',
    },
    {
        title: '简答题',
        dataIndex: 'shortAnswer',
        key: 'shortAnswer',
    },

]
const state = reactive({
    queryInfo: {
        bankName: '',
        pageNo: 1,
        pageSize: 10,
    },
    data: [],
    total: 0,
    selectedRowKeys: []
});

const addFormRules = reactive({
    bankName: [
        { required: true, message: '请输入科目名称', trigger: 'blur' }
    ]
})
const addForm = reactive({
    bankName: '',

});
const addFormRef = ref();
const addVisible = ref(false);

const getList = async () => {
    try {
        const res = await run(state.queryInfo);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
};

const queryData = (params: APIParams) => {
    const defaultParams = {
        bankName: '',
        pageNo: 1,
        pageSize: 10,
    }
    const queryParams = Object.assign({}, toRaw(defaultParams), toRaw(params));
    return request("GET", API.teacher.getBankHaveQuestionSumByType, queryParams);
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

const dataSource = computed(() => data?.value?.data || [])
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
const handleDelete = () => {
    Modal.confirm({
        title: '删除题库',
        icon: createVNode(ExclamationCircleOutlined),
        content: '此操作将永久删除该题库, 是否继续？',
        okText: '确认',
        okType: 'danger',
        okButtonProps: {
            disabled: true,
        },
        cancelText: '取消',
        onOk() {
            request("GET", API.teacher.deleteQuestionBank, { 'ids': state.selectedRowKeys.join(',') }).then((res: Res<string>) => {
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
//添加题库
const addSubject = () => {
    request("POST", API.teacher.addQuestionBank, addForm).then((resp: Res<any[]>) => {
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
    addFormRef.value.validate().then(addSubject).catch(addSubjectFailed)
}
const addSubjectFailed = (error: any) => {
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
.subjects{
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