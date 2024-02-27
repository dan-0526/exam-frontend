import axios, {AxiosRequestConfig} from 'axios';
// request.js
// 创建新的axios实例
const service = axios.create({
    // 环境变量，需要在.env文件中配置
    baseURL: window.EXAM_CONFIG.BASEURL,
    // baseURL: process.env.NODE_ENV === "development" ? window.EXAM_CONFIG.BASEURL : window.EXAM_CONFIG.BASEURL,
    // 超时时间暂定5s
    timeout: 5000,
});
// request.js
// request.js
service.interceptors.response.use(
    (    response: any) => {
        return response;
    },
    (    error: { response: { status: any; }; message: string; }) => {
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
const Request = (url: AxiosRequestConfig, options: any = {}) => {
    let method = options.method || 'get';
    let params = options.params || {};

    if (method === 'get' || method === 'GET') {
        return new Promise((resolve, reject) => {
            service
                .get(url, {
                    params: params,
                })
                .then((res: { data: unknown; }) => {
                    if (res && res.data) {
                        resolve(res.data);
                    }
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    } else {
        return new Promise((resolve, reject) => {
            service
                .post(url, params)
                .then((res: { data: unknown; }) => {
                    if (res && res.data) {
                        resolve(res.data);
                    }
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
};
// request.js
export default Request;
