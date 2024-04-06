<template>
  <a-modal title="修改个人信息" v-model:open="props.visible" width="60%" class="settings" @cancel="handleBack" @ok="handleOk" cancelText="取消"
    okText="确定" :destroyOnClose="true">
    <a-form :model="settingForm" :rules="settingFormRules" ref="settingFormRef" @finish="onFinish"
      @finishFailed="onFinishFailed" v-bind="layout">
      <a-form-item label="用户名" prop="username">
        <a-input v-model:value="settingForm.username" :disabled="true"></a-input>
      </a-form-item>

      <a-form-item label="真实姓名" prop="realname">
        <a-input v-model:value="settingForm.realname"></a-input>
      </a-form-item>
      <a-form-item label="昵称" prop="nickname">
        <a-input v-model:value="settingForm.nickname"></a-input>
      </a-form-item>
      <a-form-item label="性别" label-width="120px" prop="sex">
        <a-radio-group v-model:value="settingForm.sex">
          <a-radio :value="2">男</a-radio>
          <a-radio :value="1">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="学号/教编号" label-width="120px" prop="code">
        <a-input v-model:value="settingForm.code"></a-input>
      </a-form-item>
      <a-form-item label="手机号" label-width="120px" prop="phone">
        <a-input v-model:value="settingForm.phone"></a-input>
      </a-form-item>
      <a-form-item label="身份证号" label-width="120px" prop="idCard">
        <a-input v-model:value="settingForm.idCard"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  reactive,
} from 'vue';
import { message } from 'ant-design-vue';
import { defineEmits } from 'vue';
import API from '../../api/api';
import request from '../../service/request';
import { Res } from '../../api/type';
import { pick } from 'lodash';
import store from '../../store';

interface UserType {
  username: string;
  realname: string;
  code: string;
  sex: 1;
  phone: string;
  idCard: string;
  nickname: string;
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const settingFormRules = reactive({
  realname: [{ required: true, message: '请输入用户真实姓名', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择用户权限', trigger: 'blur' }],
  code: [{ length: 10, message: '学号/教编号必须10位', trigger: 'blur' }],
  phone: [{ length: 11, message: '手机号必须11位', trigger: 'blur' }],
  idCard: [{ length: 18, message: '身份证号必须18位', trigger: 'blur' }],
})
const USER_PROPERTIES = ["username", "realname", "code", "sex", "phone", "idCard", "nickname"]
const personalData = store.state.personalData

const settingForm = reactive<UserType>({
  username: '',
  realname: '',
  code: '',
  sex: 1,
  phone: '',
  idCard: '',
  nickname: '',
});
const settingFormRef = ref();

const getUserInfo = () => {
  Object.assign(settingForm, pick(personalData, USER_PROPERTIES));
  console.log(personalData);
}
getUserInfo()
const emit = defineEmits(['back']);

const handleBack = () => {
  emit('back', false);
  settingFormRef.value.resetFields();
};

const handleOk = () => {
  settingFormRef.value.validate().then(onFinish).catch(onFinishFailed)
}

//表单信息提交
const onFinish = (values: any) => {
  console.log(values);
  const userInfo = {
      ...values,
      sex: Number(values.sex),
  };
  request("POST", API.common.updateCurrentUser, userInfo).then((resp: Res<string>) => {
      if (resp.code === 200) {
          message.success(resp.message)
          // const newData = {
          //     ...personalData,
          //     ...userInfo,
          // }
          // store.commit('SET_PERSONALDATA', newData);

      } else {
          message.error(resp.message)
      }
      handleBack();
  }).catch((err) => {
      message.error(err)
  })
};
const onFinishFailed = (error: any) => {
  console.log('Failed:', error);
  if (error.errorFields.length > 0) {
    error.errorFields.forEach((item: { errors: string[] }) => {
      message.warning(item.errors[0]);
    });
    return;
  } else {
    message.warning('请检查您所填写的信息是否有误'); // 请检查考试规则设置是否完整
  }
};


onMounted(() => {
  
});
defineExpose({});
</script>

<style></style>
