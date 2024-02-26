<template>
  <a-layout class="layout" id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
      <div>用户名</div>
    </a-layout-header>
    <a-layout
        has-sider 
        :style="{ display: 'flex', height: 'calc(100vh - 56px)'}"
      >
      <a-layout-sider class="sider">
        <a-menu
          v-model:selectedKeys="state.selectedKeys"
          v-model:openKeys="state.openKeys"
          mode="inline"
          :items="items"
          @click="handleMenu"
          :style="{ height: '100%', borderRight: 0, display: 'flex', flexDirection: 'column'}"
        >
        </a-menu>
      </a-layout-sider>

      <a-layout-content class="content">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { h, reactive, watch } from 'vue';
import { UserOutlined, TeamOutlined, HomeOutlined, TableOutlined, SolutionOutlined, ReadOutlined, ProfileOutlined } from '@ant-design/icons-vue/lib';
import { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const state = reactive({
  collapsed: false,
  selectedKeys: ['home'],
  openKeys: ['task'],
  preOpenKeys: ['task'],
});

// const iconMap = reactive({
//   user: UserOutlined,
//   home: HomeOutlined,
//   setting: SettingOutlined,
//   personal: TeamOutlined,
//   records: TableOutlined,
//   task: SolutionOutlined,
//   paper: ReadOutlined,
//   questionBank: ProfileOutlined,
// });
const items = reactive([
  {
    key: 'home',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: 'user',
    icon: () => h(UserOutlined),
    label: '用户信息',
    title: '用户信息',
  },
  {
    key: 'personalManagement',
    icon: () => h(TeamOutlined),
    label: '人员管理',
    title: '人员管理',
  },
  {
    key: 'questionBank',
    icon: () => h(ProfileOutlined),
    label: '考试题库',
    title: '考试题库',
  },
  {
    key: 'paperManagement',
    icon: () => h(ReadOutlined),
    label: '考试试卷',
    title: '考试试卷',
  },
  {
    key: 'task',
    icon: () => h(SolutionOutlined),
    label: '考试任务',
    title: '考试任务',
    children: [
      {
        key: 'taskList',
        label: '任务列表',
        title: '任务列表',
      },
      {
        key: 'myTask',
        label: '我的任务',
        title: '我的任务',
      }
    ],
  },
  {
    key: 'examRecords',
    icon: () => h(TableOutlined),
    label: '考试记录',
    title: '考试记录',
  },
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);
const handleMenu: MenuProps['onClick'] = e => {
  console.log('click', e);
  router.push({ path: `/${e.key}` })
};
</script>
<style scoped>
.layout {
  /* background-color: #FFF; */
  .header {
    display: flex;
    justify-content: space-between;
    background-color: #658FE7;
  }
  .sider {

  }
  .sider .ant-menu .ant-menu-item .ant-menu-item-icon{
      font-size: 16px;
    }
  .content {
  }
}
</style>

