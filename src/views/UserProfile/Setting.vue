<template>
  <a-modal title="修改个人信息" v-model:open="props.visible" width="60%" :footer="null" class="settings">
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
          <a-radio value="2">男</a-radio>
          <a-radio value="1">女</a-radio>
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
      <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
        <a-space>
          <a-button @click="handleBack" size="large">取消</a-button>
          <a-button type="primary" html-type="submit" size="large">提交</a-button>
        </a-space>
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
const settingForm = reactive({
  username: 'yelan',
  realname: '夜兰',
  code: '',
  sex: '',
  phone: '',
  idCard: '',
  nickname: '',
});
const settingFormRef = ref();

const emit = defineEmits(['back']);

const handleBack = () => {
  console.log(111)
  emit('back', false);
};



//表单信息提交
const onFinish = (values: any) => {
  console.log(values);
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
