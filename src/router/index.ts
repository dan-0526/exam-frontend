import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '登陆',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/home',
        name: '主页',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/user',
        name: '用户信息',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/UserProfile/index.vue')
    },
    {
        path: "/questionBank",
        name: "考试题库",
        component: () => import('../views/QuestionBank/index.vue')
    },
    {
        path: '/examTask',
        name: '考试任务',
        children: [
            {
                path: '/taskList',
                name: '任务列表',
                component: () => import('../views/ExamTask/TaskList.vue')
            },
            {
                path: '/myTask',
                name: '我的任务',
                component: () => import('../views/ExamTask/MyTask.vue')
            }
            // {
            //     path: 'task/:id',
            //     name: '任务详情',
            //     component: () => import('../views/ExamTask/TaskDetail.vue')
            // }
        ]
    },
    {
        path: '/examRecords',
        name: '考试记录',
        component: () => import('../views/ExamRecords/index.vue')
    },
    {
        path: '/onlineExam/:id',
        name: '在线考试',
        component: () => import('../views/OnlineExam/index.vue'),
    },
    {
        path: '/paperManagement',
        name: '考试试卷',
        component: () => import('../views/PaperManagement/index.vue')
    },
    {
        path: '/personalManagement',
        name: '人员管理',
        component: () => import('../views/PersonalManagement/index.vue')
    },
    {
        path: '/setting',
        name: '设置',
        component: () => import('../views/Setting/index.vue')
    },
]

const router = createRouter({
    history: createWebHistory(""),
    routes
})

export default router
