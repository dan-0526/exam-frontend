<template>
  <a-modal title="重置密码" v-model:open="props.visible" width="45%" @cancel="handleBack" @ok="handleOk" cancelText="取消"
    okText="确定" :destroyOnClose="true">

    <a-form :model="psdForm" :rules="psdFormRules" ref="psdFormRef" @finish="onFinish" @finishFailed="onFinishFailed"
      v-bind="layout">
      <a-form-item label="新密码" label-width="120px" prop="password">
        <a-input v-model:value="psdForm.password"></a-input>
      </a-form-item>
      <a-form-item label="确认密码" label-width="120px" prop="confirmPassword">
        <a-input v-model:value="psdForm.confirmPassword"></a-input>
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
import request from '../../service/request';
import API from '../../api/api';
import { Res } from '../../api/type';

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

const psdForm = reactive({
  password: '',
  confirmPassword: ''
})
const psdFormRef = ref()

const validatePass2 = (_rule: any, value: string, callback: any) => {
  if (value.length > 0 && value !== psdForm.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
}
const psdFormRules = reactive({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
})
const emit = defineEmits(['back']);

const handleBack = () => {
  emit('back', false);
  psdFormRef.value.resetFields();
};


const handleOk = () => {
  console.log('addForm', psdForm);
  psdFormRef.value.validate().then(onFinish).catch(onFinishFailed)
}
//表单信息提交
const onFinish = (values: any) => {
  console.log(values);
  const {password} = values;
  request("POST", API.common.updateCurrentUserPassword, {password}).then((resp: Res<string>) => {
      if (resp.code === 200) {
          message.success(resp.message)
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
  // getPage()
});
defineExpose({});
</script>

<style></style>
