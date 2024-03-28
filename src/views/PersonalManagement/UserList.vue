<template>
  <div class="user-list">

    <a-row style="margin-top: 16px;">
      <a-space>
      <a-input v-model="state.queryInfo.loginName" @blur="getList" placeholder="搜索用户名" ></a-input>
      <a-input v-model="state.queryInfo.realname" @blur="getList" placeholder="搜索姓名"></a-input>
    </a-space>
    </a-row>
    <a-row style="margin: 16px 0;">
      <a-space>
      <a-button type="primary" @click="showAddDialog">
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
      :row-key="(record: any) => record.id" :data-source="dataSource" :pagination="pagination" @change="handleTableChange" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'roleId'">
          <span>{{ roleStatusArr[record.roleId] }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            <a-tag :color="record.status === 1 ? 'green' : 'gray'">
              {{ record.status === 1 ? '正常' : '禁用' }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'sex'">
          <span>
            {{ record.sex === 1 ? '女' : record.sex === 2 ? '男' : '' }}
          </span>
        </template>
      </template>
    </a-table>
    <a-modal title="添加用户" v-model:open="addVisible" width="45%" @cancel="resetAddForm" @ok="handleOk" cancelText="取消" okText="确定">

      <a-form 
        :model="addForm" 
        :rules="addFormRules" 
        ref="addFormRef" 
        @finish="addUser" 
        @finishFailed="addUserFailed" 
        v-bind="layout"
      >

        <a-form-item label="用户名" label-width="120px" prop="username">
          <a-input v-model:value="addForm.username"></a-input>
        </a-form-item>

        <a-form-item label="密码" label-width="120px" prop="password">
          <a-input v-model:value="addForm.password" type="password" show-password></a-input>
        </a-form-item>

        <a-form-item label="角色" label-width="120px" prop="roleId">
          <a-select v-model:value="addForm.roleId" placeholder="请选择用户权限">
            <a-select-option value="1">学生</a-select-option>
            <a-select-option value="2">老师</a-select-option>
            <a-select-option value="3">超级管理员</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="姓名" label-width="120px" prop="realname">
          <a-input v-model:value="addForm.realname"></a-input>
        </a-form-item>
        <a-form-item label="性别" label-width="120px" prop="sex">
          <a-radio-group v-model:value="addForm.sex">
            <a-radio value="2">男</a-radio>
            <a-radio value="1">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="学号/教编号" label-width="120px" prop="code">
          <a-input v-model:value="addForm.code"></a-input>
        </a-form-item>
        <a-form-item label="手机号" label-width="120px" prop="phone">
          <a-input v-model:value="addForm.phone"></a-input>
        </a-form-item>
        <a-form-item label="身份证号" label-width="120px" prop="idCard">
          <a-input v-model:value="addForm.idCard"></a-input>
        </a-form-item>

      </a-form>
    </a-modal>

  </div>

</template>

<script setup lang="ts">
import { ref, reactive, computed, toRaw } from 'vue';
import request from '../../service/request';
import API from '../../api/api'
import { TableProps, message } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { Res } from '../../api/type';
type APIParams = {
    loginName?: string,
    realname?: string,
    pageNo?: number,
    pageSize?: number,
    [key: string]: any;
};
const validatorUsername = (_: any, value: any) => {
  if(value.length === 0) {
    return Promise.resolve();
  }
  return request("GET", `${API.common.checkUsername}/${value}`).then((resp) => {
    if (resp.code === 200) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('用户名已存在'));
    }
  });
}
const roleStatusArr = ["未知", "学生", "老师", "超级管理员"]
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const columns = [
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 140,
        ellipsis: true,
    },
    {
        title: '姓名',
        dataIndex: 'realname',
        key: 'realname',
        width: 130,
        ellipsis: true,
    },
    {
        title: '角色',
        dataIndex: 'roleId',
        key: 'roleId',
        width: 120,
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        ellipsis: true,
    },
    {
        title: '学号/教编号',
        dataIndex: 'code',
        key: 'code',
        width: 120,
    },
    {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 80,
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        ellipsis: true,
    },
    {
        title: '身份证号',
        dataIndex: 'idCard',
        key: 'idCard',
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 180,
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
]
const state = reactive({
  queryInfo: {
    loginName: '',
    realname: '',
    pageNo: 1,
    pageSize: 10,
  },
  data: [],
  total: 0,
  selectedRowKeys: []
});

const addFormRules = reactive({
  username: [
    { required: true, message: '请输入登录用户名', trigger: 'blur' },
    {
      validator: validatorUsername,
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, message: '密码必须5位以上', trigger: 'blur' },
  ],
  realname: [{ required: true, message: '请输入用户真实姓名', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择用户权限', trigger: 'blur' }],
  code: [{ length: 10, message: '学号/教编号必须10位', trigger: 'blur' }],
  phone: [{ length: 11, message: '手机号必须11位', trigger: 'blur' }],
  idCard: [{ length: 18, message: '身份证号必须18位', trigger: 'blur' }],
})
const addForm = reactive({
  username: '',
  password: '',
  roleId: '',
  realname: '',
  code: '',
  sex: '',
  phone: '',
  idCard: '',
  nickname: '',
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
    loginName: '',
    realname: '',
    pageNo: 1,
    pageSize: 10,
  }
  const queryParams = Object.assign({}, toRaw(defaultParams), toRaw(params));
  return request("GET", API.admin.getUserInfo, queryParams);
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
  total: (data as unknown as [])?.length,
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
//功能下拉框被选择
const handleChange = (val: string) => {
  //清空上一次的操作

  if (val === 'on') {//状态设置为正常
    request("GET", API.admin.handleUser + '/' + 1, { 'userIds': state.selectedRowKeys.join(',') }).then((resp: Res<string>) => {
      if (resp.code === 200) {
        //删除成功后,回调更新用户数据
        getList()
        message.success('启用成功')
        state.selectedRowKeys = [];
      } else {
        message.error('操作失败')
      }
    })
  } else if (val === 'off') {//禁用用户
    request("GET", API.admin.handleUser + '/' + 2, { 'userIds': state.selectedRowKeys.join(',') }).then((resp: Res<string>) => {
      if (resp.code === 200) {
        getList()
        message.success('禁用成功')
        state.selectedRowKeys = [];

      } else {
        message.error('禁用失败')
      }
    })
  } else if (val === 'delete') {//删除用户
    request("GET", API.admin.handleUser + '/' + 3, { 'userIds': state.selectedRowKeys.join(',') }).then((resp: Res<string>) => {
      if (resp.code === 200) {
        //删除成功后,回调更新用户数据
        getList()
        message.success('删除成功');
        state.selectedRowKeys = [];
      } else {
        message.error('删除失败')
      }
    })
  }
}

//点击添加按钮
const showAddDialog = () => {
  addVisible.value = true
}
//添加用户
const addUser = () => {
  const addParams = {
    ...addForm,
    sex: addForm !== null ? Number(addForm.sex) : null
  }
  request("POST", API.admin.addUser, addParams).then((resp: Res<any[]>) => {
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
  addFormRef.value.validate().then(addUser).catch(addUserFailed)
}
const addUserFailed = (error: any) => {
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
.user-list {
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
