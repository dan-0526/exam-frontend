<template>
  <div class="login">
    <a-form :model="formState" name="basic" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" :colon="false" autocomplete="off" class="login-box"
      @finish="onFinish" @finishFailed="onFinishFailed">
      <a-row class="login-header">
        <img src="/vite.svg" class="logo" alt="考试管理系统" />
        考试管理系统
      </a-row>
      <div class="login-form-items">
        <a-form-item label="" name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
          <a-input v-model:value="formState.username" size="large" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="formState.password" size="large" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 24}">
          <a-button type="primary" html-type="submit" size="large" class="login-button">登陆</a-button>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';

interface FormState {
  username: string;
  password: string;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>


<style>
.login {
  background: url("/cloudBg.jpg") no-repeat 0 0 / 100% 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  background-color: rgba(255,255,255, 0.2);
  height: 520px;
  width: 720px;
}
.login-header {
  background-color: #658FE7;
  height: 56;
  color: #fff;
  opacity: 0.8;
  font-size: 24px;
  line-height: 56px;
  padding: 0 18px;
}
.login-form-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 15% 20%;
  width: 60%;
  text-align: left;
  label {
    color: #133276 !important;
    font-size: 20px !important;
  }
}
.login-button{
  width: 100%;
  border-left: transparent;
  background-image: linear-gradient(to right, #b3cee1, #396EE0);
  margin-top: 24px;
}
</style>