<template>
  <a-layout class="layout" id="components-layout-demo-top-side-2" has-sider>
    <a-layout-sider class="sider">
      <div
        style="height: 52px;font-size: 28px; line-height: 52px;text-shadow:2px 2px #91AFED;background-color: #fff;color: #658FE7; font-weight: 800">
        考试管理系统
      </div>
      <a-menu v-model:selectedKeys="state.selectedKeys" v-model:openKeys="state.openKeys" mode="inline" :items="items"
        @click="handleMenu"
        :style="{ height: 'calc(100vh - 52px)', borderRight: 0, display: 'flex', flexDirection: 'column', textAlign: 'left', paddingTop: '16px' }">
      </a-menu>
    </a-layout-sider>

    <a-layout has-sider :style="{ display: 'flex', height: '100vh', flexDirection: 'column' }">
      <a-layout-header class="header">
        <div class="breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item v-for="(item, index) in state.breadcrumb" :key="index">
              {{ item }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="user">

          <a-dropdown>
            <a-button :icon="h(RedditOutlined)" size="large" type="ghost">
              {{ curUserInfo.username }}
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu @click="handleUser">
                <a-menu-item key="resetPsd">
                  <LockOutlined />
                  重置密码
                </a-menu-item>
                <a-menu-item key="setting">
                  <UserOutlined />
                  个人资料
                </a-menu-item>
                <a-menu-item key="logout">
                  <LogoutOutlined />
                  退出登陆
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
  <a-modal title="重置密码" v-model:open="psdVisible" width="45%" @cancel="cancelResetPsd" @ok="handleOk"
            cancelText="取消" okText="确定">

            <a-form :model="psdForm" :rules="psdFormRules" ref="psdFormRef" @finish="resetPsd"
                @finishFailed="resetPsdFailed" v-bind="layout">
                <a-form-item label="新密码" label-width="120px" prop="password">
                    <a-input v-model:value="psdForm.password"></a-input>
                </a-form-item>
                <a-form-item label="确认密码" label-width="120px" prop="confirmPassword">
                    <a-input v-model:value="psdForm.confirmPassword"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
        <Setting :visible="settingVisible" @back="handleBack" />
</template>
<script lang="ts" setup>
import { h, onMounted, reactive, ref, watch } from 'vue';
import { UserOutlined, TeamOutlined, HomeOutlined, TableOutlined, LockOutlined, LogoutOutlined, RedditOutlined, DownOutlined, SolutionOutlined, ReadOutlined, ProfileOutlined, SettingOutlined, FileTextOutlined, ScheduleOutlined, FileSearchOutlined, FileDoneOutlined, FundOutlined, UnorderedListOutlined, SlidersOutlined, BookOutlined } from '@ant-design/icons-vue/lib';
import { MenuProps, message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import API from '../api/api';
import request from '../service/request';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Setting from '../views/UserProfile/Setting.vue';

const store = useStore();
const route = useRoute();
const router = useRouter()
const state = reactive({
  collapsed: false,
  selectedKeys: ['home'],
  openKeys: [],
  preOpenKeys: [],
  breadcrumb: ["主页"]
});

const iconMap = {
  home: HomeOutlined,
  setting: SettingOutlined,
  personalManagement: UserOutlined,
  userList: TeamOutlined,
  systemRole: SolutionOutlined,
  examStatistics: SlidersOutlined,
  questionManagement: ProfileOutlined,
  subjects: BookOutlined,
  questionBank: TableOutlined,
  examManagement: FileTextOutlined,
  examPaper: ReadOutlined,
  marking: FileSearchOutlined,
  examRecords: FileDoneOutlined,
  examTask: UnorderedListOutlined,
  examList: ProfileOutlined,
  myGrade: FundOutlined,
  examTraining: ScheduleOutlined,

};
const items = reactive([
  {
    key: 'home',
    icon: () => h(iconMap.home),
    label: '主页',
    title: '主页',
  },
  {
    key: 'personalManagement',
    icon: () => h(iconMap.personalManagement),
    label: '人员管理',
    title: '人员管理',
    children: [
      {
        key: 'userList',
        icon: () => h(iconMap.userList),
        label: '用户列表',
        title: '用户列表',
      },
      {
        key: 'systemRole',
        icon: () => h(iconMap.systemRole),
        label: '系统角色',
        title: '系统角色',
      }
    ],
  },
  {
    key: 'examStatistics',
    icon: () => h(iconMap.examStatistics),
    label: '考试统计',
    title: '考试统计',
  },
  {
    key: 'questionManagement',
    icon: () => h(iconMap.questionManagement),
    label: '试题管理',
    title: '试题管理',
    children: [
      {
        key: 'subjects',
        icon: () => h(iconMap.subjects),

        label: '考试科目',
        title: '考试科目',
      },
      {
        key: 'questionBank',
        icon: () => h(iconMap.questionBank),

        label: '考试题库',
        title: '考试题库',
      }
    ],
  },
  {
    key: 'examManagement',
    icon: () => h(iconMap.examManagement),
    label: '考试管理',
    title: '考试管理',
    children: [
      {
        key: 'examPaper',
        label: '考试试卷',
        title: '考试试卷',
        icon: () => h(iconMap.examPaper),
      },
      {
        key: 'marking',
        icon: () => h(iconMap.marking),
        label: '阅卷管理',
        title: '阅卷管理',
      },
      {
        key: 'examRecords',
        icon: () => h(iconMap.examRecords),
        label: '考试记录',
        title: '考试记录',
      },
    ],
  },
  {
    key: 'examTask',
    icon: () => h(iconMap.examTask),
    label: '考试任务',
    title: '考试任务',
    children: [
      {
        key: 'examList',
        label: '考试列表',
        title: '考试列表',
        icon: () => h(iconMap.examList),
      },
      {
        key: 'myGrade',
        label: '我的成绩',
        title: '我的成绩',
        icon: () => h(iconMap.myGrade),
      },
      {
        key: 'examTraining',
        icon: () => h(iconMap.examTraining),
        label: '题库训练',
        title: '题库训练',
      },
    ],
  },

]);
const curUserInfo = ref({
  username: '',
  roleId: '',
  realName: '',
  nickName: ''
})
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);
watch(() => route.path, (_newVal, _oldVal) => {
  console.log("app.vue——————", route, _newVal, _oldVal);
  if (route.path === '/') {
    state.selectedKeys = ['home'];
  } else {
    state.selectedKeys = [route.path.slice(1)];
  }

})
const getMenu = () => {

};
const getUserInfo = async () => {
  try {
    const res = await request("GET", API.common.checkToken);
    if (res.code !== 200) {
      message.error(res.message);
      localStorage.removeItem('username')
      localStorage.removeItem("authorization")
      store.commit('SET_TOKEN', "");
      await router.push({ path: '/login' });
      return;
    }
    curUserInfo.value = res.data
    localStorage.setItem('username', res.data.username)
    store.commit('SET_USERINFO', res.data);
  } catch (err) {
    console.log(err);
  }
}
onMounted(() => {
  getMenu();
  getUserInfo();
})
const handleMenu: MenuProps['onClick'] = e => {
  console.log("handleMenu_____", e);
  router.push({ path: `/${e.key}` });
  const pathList = e.keyPath ?? [];
  if (pathList.length === 1) {
    state.breadcrumb = [(e.item.title ?? "") as string]
  } else {
    const firstMenu = items.find((i) => i.key === pathList[0]);
    if (firstMenu) {
      state.breadcrumb = [firstMenu.title, (e.item.title ?? "") as string]
    }
  }
};
const handleUser: MenuProps['onClick'] = e => {
  console.log('click', e);
  if (e.key === 'logout') {
    logout();
  } else if (e.key === 'resetPsd') {
    psdVisible.value = true
  } else if (e.key === 'setting') {
    settingVisible.value = true
  }
};
const logout = async () => {
  localStorage.removeItem('username')
  localStorage.removeItem("authorization")
  store.commit('SET_TOKEN', "");
  try {
    const res = await request("GET", API.common.logout);
    if (res.code === 200) {
      message.success('注销成功');
      await router.push({ path: '/login' });
    } else {
      message.error('服务器异常，注销失败');
    }
  } catch (_err) {
    message.error('服务器异常，注销失败');
  }

};
const psdForm = reactive({
    password: '',
    confirmPassword: ''
})
const psdVisible = ref(false)
const psdFormRef = ref()
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const validatePass2 = (_rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== psdForm.password) {
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

const resetPsd = () => {
    // request("POST", API.teacher.addQuestionBank, addForm).then((resp: Res<any[]>) => {
    //     if (resp.code === 200) {
    //         message.success(resp.message)
    //     } else {
    //         message.error(resp.message)
    //     }
    //     addVisible.value = false
    // }).catch(() => {
    //     message.error('添加失败')
    // })
}
const handleOk = () => {
    console.log('addForm', psdForm);
    psdFormRef.value.validate().then(resetPsd).catch(resetPsdFailed)
}
const resetPsdFailed = (error: any) => {
    console.log('Failed:', error);
    message.warning('请检查您所填写的信息是否有误');
}
//表单信息重置
const cancelResetPsd = () => {
    psdFormRef.value.resetFields();
    psdVisible.value = false
}
const settingVisible = ref(false)
const handleBack = (newVisible: boolean) => {
  console.log('handleBack', newVisible);
  settingVisible.value = newVisible
}
</script>
<style>
.layout {

  /* background-color: #FFF; */

}

.layout .header {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 5px 5px 10px -4px #BDCFF4;
  height: 52px;
  z-index: 2;
}

.breadcrumb .ant-breadcrumb {
  line-height: 52px;
}

.layout .sider {}

.layout .sider .ant-menu .ant-menu-item .ant-menu-item-icon {
  font-size: 16px;
}

.layout .content {
  height: calc(100vh - 52px);
  width: 100% !important;
  overflow-y: overlay;
}
</style>
