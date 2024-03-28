import axios, { AxiosRequestConfig } from 'axios';
import store from '../store';

const getToken = () => {
    const token = store.getters.token ?? localStorage.getItem('authorization') ?? "";
    return token;
};
// request.js
// 创建新的axios实例
const service = axios.create({
    // 环境变量，需要在.env文件中配置
    baseURL: window.EXAM_CONFIG.BASEURL,
    // baseURL: process.env.NODE_ENV === "development" ? window.EXAM_CONFIG.BASEURL : window.EXAM_CONFIG.BASEURL,
    // 超时时间暂定5s
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
      },
});
// request.js
// 请求拦截器，添加token到headers
service.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, error => Promise.reject(error));
// request.js
service.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error: { response: { status: any; }; message: string; }) => {
        // 处理异常情况，根据项目实际情况处理或不处理
        if (error && error.response) {
            // 根据约定的响应码处理
            switch (error.response.status) {
                case 403:
                    error.message = '拒绝访问';
                    break;
                case 502:
                    error.message = '服务器端出错';
                    break;
                default:
                    error.message = `连接错误${error.response.status}`;
            }
        } else {
            // 超时处理
            error.message = '服务器响应超时，请刷新当前页';
        }
        return Promise.resolve(error.response);
    }
);
// request.js
const Request = async (method: AxiosRequestConfig['method'], url: string, data?: any, customConfig?: AxiosRequestConfig) => {
    let apiUrl = url;
    if (method === 'GET' && data) {
        console.log(data);
        const querystring = new URLSearchParams(data);
        apiUrl = `${url}?${querystring.toString()}`;
    }
    const finalConfig: AxiosRequestConfig = {
        method,
        url: apiUrl,
        ...(method !== 'GET' && { data }), // 对于非GET请求，才将data放入配置
        headers: {
            'Content-Type': 'application/json',
            ...customConfig?.headers, // 合并自定义headers
          },
          ...(customConfig || {}), // 合并其他自定义配置项
    };

    try {
        const response = await service(finalConfig);
        return response.data;
    } catch (err) {
        throw err.response || err;
    }
};
// request.js
export default Request;
