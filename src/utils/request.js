import axios from 'axios'
// import {Message,MessageBox,Loading} from 'element-ui'


// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 3000 // request timeout
})

// axios请求拦截,前端发起请求之前拦截
service.interceptors.request.use(config => {
  if(localStorage.getItem("token")){
    config.headers["Authorization"]=localStorage.getItem("token")
  }
  return config
}

)

// axios响应拦截,后端返回响应后拦截
service.interceptors.response.use(
  response => {
    return response
  })

/**
 * get
 * @param url
 * @param params
 * @returns {Promise<any>}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * post请求
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      method: 'POST',
      url: url,
      data: data
    }).then(response => {
      resolve(response);
    })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * patch请求
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    service.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, error => {
        reject(error);
      });
  });
}

/**
 * put请求
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    service.put(url, data)
      .then(response => {
        resolve(response.data);
      }, error => {
        reject(error);
      });
  });
}

export default service
