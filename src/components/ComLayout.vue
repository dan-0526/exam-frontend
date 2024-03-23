<template>
  <a-layout class="layout" id="components-layout-demo-top-side-2" has-sider>
    <a-layout-sider class="sider">
      <div style="height: 52px;font-size: 24px; line-height: 52px;background-color: #91AFED;">
        考试管理系统
      </div>
      <a-menu v-model:selectedKeys="state.selectedKeys" v-model:openKeys="state.openKeys" mode="inline" :items="items"
        @click="handleMenu" :style="{ height: 'calc(100vh - 52px)', borderRight: 0, display: 'flex', flexDirection: 'column', textAlign: 'left' }">
      </a-menu>
    </a-layout-sider>

    <a-layout has-sider :style="{ display: 'flex', height: '100vh', flexDirection: 'column' }">
      <a-layout-header class="header">
        <div class="system-name">考试管理系统</div>
        <div class="user">用户名</div>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';
import { UserOutlined, TeamOutlined, HomeOutlined, TableOutlined, SolutionOutlined, ReadOutlined, ProfileOutlined, SettingOutlined, FileTextOutlined, ScheduleOutlined, FileSearchOutlined, FileDoneOutlined, FundOutlined, UnorderedListOutlined, SlidersOutlined, BookOutlined } from '@ant-design/icons-vue/lib';
import { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const state = reactive({
  collapsed: false,
  selectedKeys: ['home'],
  openKeys: ['personalManagement'],
  preOpenKeys: ['personalManagement'],
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
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);
const getMenu = () => {
  
};
onMounted(() => {
  getMenu();
})
const handleMenu: MenuProps['onClick'] = e => {
  router.push({ path: `/${e.key}` })
};
</script>
<style>
.layout {

  /* background-color: #FFF; */

}
.layout .header {
    display: flex;
    justify-content: space-between;
    background-color: #658FE7;
  }

  .layout  .sider {}

  .layout  .sider .ant-menu .ant-menu-item .ant-menu-item-icon {
    font-size: 16px;
  }

  .layout  .content {
    height: calc(100vh - 52px);
    width: 100% !important;
    overflow-y: overlay;
  }
</style>
