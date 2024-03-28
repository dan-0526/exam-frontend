import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '../store';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '登陆',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/login',
        name: '登陆',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/register',
        name: '登陆',
        component: () => import('../views/Register.vue'),
    },
    {
        path: '/home',
        name: '主页',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/user',
        name: '用户信息',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/UserProfile/index.vue')
    },
    {
        path: '/personalManagement',
        name: '人员管理',
        children: [
            {
                path: '/userList',
                name: '用户列表',
                component: () => import('../views/PersonalManagement/UserList.vue'),
            },
            {
                path: '/systemRole',
                name: '系统角色',
                component: () => import('../views/PersonalManagement/SystemRole.vue'),
            }
        ],
    },
    {
        path: '/questionManagement',
        name: '试题管理',
        children: [
            {
                path: '/subjects',
                name: '考试科目',
                component: () => import('../views/QuestionManagement/Subjects.vue'),
            },
            {
                path: '/questionBank',
                name: '考试题库',
                component: () => import('../views/QuestionManagement/QuestionBank.vue'),
            }
        ],
    },
    {
        path: '/examManagement',
        name: '考试管理',
        children: [
            {
                path: '/examPaper',
                name: '考试试卷',
                component: () => import('../views/PaperManagement/UserList.vue'),
            },
            {
                path: '/marking',
                name: '阅卷管理',
                component: () => import('../views/ExamTask/MyTask.vue'),
            },
            {
                path: '/examRecords',
                name: '考试记录',
                component: () => import('../views/ExamRecords/index.vue'),
            }
        ],
    },
    {
        path: '/examTask',
        name: '考试任务',
        children: [
            {
                path: '/examList',
                name: '考试列表',
                component: () => import('../views/PaperManagement/UserList.vue'),
            },
            {
                path: '/myGrade',
                name: '我的成绩',
                component: () => import('../views/ExamTask/MyTask.vue'),
            },
            {
                path: '/examTraining',
                name: '题库训练',
                component: () => import('../views/ExamTask/MyTask.vue'),
            },
            {
                path: '/examResult',
                name: '考试结果',
                component: () => import('../views/ExamRecords/index.vue'),
            },
            {
                path: '/train/:bankId/:trainType',
                name: '训练详情',
                component: () => import('../views/ExamTask/MyTask.vue')
            }
        ],
    },
    {
        path: '/examStatistics',
        name: '考试统计',
        component: () => import('../views/ExamRecords/index.vue'),
    },
    {
        path: '/onlineExam/:id',
        name: '在线考试',
        component: () => import('../views/OnlineExam/index.vue'),
    },
    {
        path: '/setting',
        name: '设置',
        component: () => import('../views/Setting/index.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});
// 添加全局前置守卫
router.beforeEach((to, from, next) => {
    console.log(to, from);
    const token = localStorage.getItem('authorization');
    let menuList: string[] = [];
    const storedMenuList = localStorage.getItem('menuList');
    if (storedMenuList) {
        menuList = JSON.parse(storedMenuList);
    }
    console.log(token, store.state.token, menuList, !token)
    if (to.path === '/' || to.path === '/register') {
        return next()
    } else if (!token && to.path !== '/login' && to.path !== '/register' && to.path !== '/') {
        // 检查是否存在token，且即将跳转到的不是/login，则跳转到/login
        console.log('没有token');
        next('/');
    }
    // else if (token && !menuList.includes(to.path)) {
    //     const taskMenu = ["/myQuestionBank", "/myQuestionBank",]
    //     // 如果已登录但没有权限访问该页面，则跳转到/home
    //     console.log('已登录但没有权限访问该页面，则跳转到/home');
    //     next('/home');
    // } 
    else {
        // 其他情况（已登录且有权限），允许继续访问
        console.log('其他情况（已登录且有权限），允许继续访问');
        next();
    }
});
export default router;
