const baseUrl = window.EXAM_CONFIG?.BASEURL ?? "http://127.0.0.1:9991";
let API = {
  common: {
    // 查询应用列表
    register:  baseUrl + '/common/register',
    //查询当前的验证码
    getCode:  baseUrl + '/util/getCode',
    //校验用户名
    checkUsername:  baseUrl + '/common/check',
    //登陆接口
    login:  baseUrl + '/common/login',
    //获取主页面的左侧menu数据
    getMenuInfo:  baseUrl + '/common/getMenu',
    //检验token合法(返回当前对象)
    checkToken:  baseUrl + '/common/checkToken',
    //用户退出登录
    logout:  baseUrl + '/common/logout',
    //查询当前用户的信息
    getCurrentUser:  baseUrl + '/common/getCurrentUser',
    //更新当前用户的信息
    updateCurrentUser:  baseUrl + '/common/updateCurrentUser',
  },
  //应用表
  admin: {
    //获取用户信息(可附带查询条件,可分页,n功能合一接口)
    getUserInfo:  baseUrl + '/admin/getUser',
    //管理员操作用户
    handleUser:  baseUrl + '/admin/handleUser',
    //管理员新增用户
    addUser:  baseUrl + '/admin/addUser',
    updateUser:  baseUrl + '/admin/updateUser',

    //获取角色信息
    getRoleInfo:  baseUrl + '/admin/getRole',

  },
  teacher: {
    //获取所有题库信息
    getQuestionBank:  baseUrl + '/teacher/getQuestionBank',
    //获取题目信息(可附带查询条件,可分页,n功能合一接口)
    getQuestion:  baseUrl + '/teacher/getQuestion',
    //批量删除题目
    deleteQuestion:  baseUrl + '/teacher/deleteQuestion',
    //将题目加入进题库
    addBankQuestion:  baseUrl + '/teacher/addBankQuestion',
    //将题目从题库中移除
    removeBankQuestion:  baseUrl + '/teacher/removeBankQuestion',
    //填加题目中的上传图片
    uploadQuestionImage:  baseUrl + '/teacher/uploadQuestionImage',
    //添加题目
    addQuestion:  baseUrl + '/teacher/addQuestion',
    //根据题目id查询题目信息
    getQuestionById:  baseUrl + '/teacher/getQuestionById',
    //根据题目id更新题目信息
    updateQuestion:  baseUrl + '/teacher/updateQuestion',
    //查询所有题库信息和里面含有的题目类型的数量
    getBankHaveQuestionSumByType:  baseUrl + '/teacher/getBankHaveQuestionSumByType',
    //删除题库及去除所有包含题库信息的题目
    deleteQuestionBank:  baseUrl + '/teacher/deleteQuestionBank',
    //添加题库信息
    addQuestionBank:  baseUrl + '/teacher/addQuestionBank',
    //根据题库id查询题库信息
    getBankById:  baseUrl + '/teacher/getBankById',
    //根据题库id查询题库中所有单选 多选 判断题
    getQuestionByBank:  baseUrl + '/teacher/getQuestionByBank',
    //根据题库id查询各种类型的题目
    getQuestionByBankIdAndType:  baseUrl + '/teacher/getQuestionByBankIdAndType',
    //查询考试信息
    getExamInfo:  baseUrl + '/teacher/getExamInfo',
    //对考试信息操作
    operationExam:  baseUrl + '/teacher/operationExam',
    //根据题库添加考试
    addExamByBank:  baseUrl + '/teacher/addExamByBank',
    //根据题目列表添加考试
    addExamByQuestionList:  baseUrl + '/teacher/addExamByQuestionList',
    //根据考试id查询考试信息和题目信息
    getExamInfoById:  baseUrl + '/teacher/getExamInfoById',
    //更新考试的规则信息
    updateExamInfo:  baseUrl + '/teacher/updateExamInfo',
    //新增考试记录
    addExamRecord:  baseUrl + '/teacher/addExamRecord',
    //根据考试记录的id查询考试记录信息
    getExamRecordById:  baseUrl + '/teacher/getExamRecordById',
    //根据考试id查询考试中的每一道题目id和分值
    getExamQuestionByExamId:  baseUrl + '/teacher/getExamQuestionByExamId',
    //根据考试记录id查询考试的信息
    getExamRecord:  baseUrl + '/teacher/getExamRecord',
    //根据考试id单纯的查询考试对象信息
    getExamById:  baseUrl + '/teacher/getExamById',
    //老师用户根据用户id查询用户
    getUserById:  baseUrl + '/teacher/getUserById',
    //查询所有的考试信息
    allExamInfo:  baseUrl + '/teacher/allExamInfo',
    //批阅试卷的客观题
    setObjectQuestionScore:  baseUrl + '/teacher/setObjectQuestionScore',
    //获取考试通过率(echarts绘图)
    getExamPassRate:  baseUrl + '/teacher/getExamPassRate',
    //获取考试的次数(echarts绘图)
    getExamNumbers:  baseUrl + '/teacher/getExamNumbers'
  },
  student: {
        //获取我的成绩(根据username)
        getMyGrade:  baseUrl + '/student/getMyGrade',
  }
}

export default API;
