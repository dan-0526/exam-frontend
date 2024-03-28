<template>
  <div class="login">
    <a-form :model="formState" name="basic" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" :colon="false" autocomplete="off" class="login-box"
      @finish="onFinish" @finishFailed="onFinishFailed" :rules="formRules" ref="formRef">
      <a-row class="login-header">
        考试管理系统
      </a-row>
      <div class="login-form-items">
        <a-form-item label="" name="username" ref="name">

          <a-input v-model:value="formState.username" size="large" placeholder="请输入用户名">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
            </a-input>
        </a-form-item>

        <a-form-item label="" name="password" ref="password">

          <a-input-password v-model:value="formState.password" size="large" placeholder="请输入密码">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="" name="code" class="form-code" ref="code">
          <a-input class="code" prefix-icon="a-icon-chat-line-round" v-model:value="formState.code" placeholder="请输入验证码" size="large">
            <template #prefix>
              <SendOutlined class="site-form-item-icon" />
            </template>
          </a-input>
              <img src="http://127.0.0.1:9991/util/getCodeImg" @click="changeCode" id="code"
                  style="float: right;margin-top: 4px;margin-left: 5px;cursor: pointer" title="看不清,点击刷新" alt="验证码"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24}">
          <a-button type="primary" html-type="submit" size="large" class="login-button">登陆</a-button>

        </a-form-item>
        <a-button type="link" @click="toRegister" class="to-register-button">
            <template #icon>
              <ArrowRightOutlined />
            </template>
            去注册
          </a-button>
          
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref } from 'vue';
import axios from 'axios';
import API from '../api/api'
import { message } from 'ant-design-vue';
import {Res} from '../api/type'
import router from '../router';
import { useStore } from 'vuex';
import { UserOutlined, LockOutlined, SendOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';

interface FormState {
  username: string;
  password: string;
  code: string;
}
console.log("login")
const store = useStore();
const validateCode = async (_rule: any, value: { toString: () => string; }) => {
        //验证码不区分大小写
        if (value.toString().toLocaleLowerCase() !== formState.code.toString().toLocaleLowerCase()) {
          return Promise.reject('验证码输入错误');
        } else {
          return Promise.resolve();
        }
      }
const formState = reactive<FormState>({
  username: '',
  password: '',
  code: ""
});
const formRules = reactive({
  username: [
    { required: true, message: '请输入用户名!' },
    { min: 4, max: 32, message: '名称长度需 4 到 32 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码!' },
    { min: 4, max: 32, message: '密码长度需 4 到 32 个字符', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码!' }, {validator: validateCode}]
});
let code = ref("");
const formRef = ref();


//获取后台验证码
const getCode = () => {
  axios.get(API.common.getCode).then((resp: { data: { message: any; }; }) => {
    code = resp.data.message
  })
}
const changeCode = () => {
  const imgCode = document.querySelector('#code') as HTMLImageElement | null;
  if (imgCode !== null) {
    imgCode.src = window.EXAM_CONFIG.BASEURL + '/util/getCodeImg?id=' + Math.random()
    imgCode.onload = () => getCode()
  }
} 
      //表单信息提交
const onFinish = (values: FormState) => {
  console.log(values);
  const data = new FormData()
  data.append('username', values.username)
  data.append('password', values.password)
  //发送登录请求
  axios.post(API.common.login, data).then(async (resp: { data: Res<string>; }) => {
    if (resp.data.code === 200) {
      localStorage.setItem('authorization', resp.data.data)
      message.warning('登陆成功^_^');
      store.commit('SET_TOKEN', resp.data.data);
      if (window.EXAM_CONFIG !== undefined) {
        window.EXAM_CONFIG.TOKEN = resp.data.data
      }
      await router.push('/home')
    } else {//请求出错
      changeCode()
      getCode()
      message.warning(resp.data.message);
    }
  }).catch((err: any) => {
    message.warning('请求出错', err);
  })
}
const onFinishFailed = (error: any) => {
  console.log('Failed:', error);
  if (error.errorFields.length > 0) {
        error.errorFields.forEach((item: { errors: string[]}) => {
            message.warning(item.errors[0]);
        });
        return;
    }
  if (code.value !== formState.code) {
      message.warning('验证码输入有误！');
    }
}
const toRegister =  () => {
  router.push('/register')
}
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
  border-radius: 18px;
  position: relative;
}
.login-header {
  background-color: #658FE7;
  height: 56;
  color: #fff;
  opacity: 0.8;
  font-size: 24px;
  line-height: 56px;
  padding: 0 18px;
  display: flex;
  justify-content: center;
  border-radius: 18px 18px 0 0;
}
.login-form-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 12% 20%;
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
.form-code .ant-form-item-control-input-content{
  display: flex;
  justify-content: space-between;
  position: relative;
}
.to-register-button{
  position: relative;
  left: 310px;
  padding: 0;
  width: 120px;
  border: none;
  cursor: pointer;
}
</style>