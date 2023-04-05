/**
 * 引入axios
 */
import axios from 'axios'
import constant from '@/conf/constant'
import global from '@/conf/global'
import { Toast } from 'vant'

/**
 * 创建axios实例
 *
 * @type {AxiosInstance}
 */
const httpService = axios.create({
  baseURL: constant.WEB_SERVER,
  timeout: 20000 // 请求超时时间
})

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

/* 网络请求部分 */

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get (url, params) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'get',
      params: params,
      headers: { 'Authorization': `${global.token}` }
    }).then(response => {
      const { data } = response
      console.log(response, 'response')
      if (data.code == 0 || data.code == 200) {
        resolve(data.data)
      } else {
        Toast({
          duration: 1000, // 持续展示 toast
          forbidClick: true,
          message: response.msg || '请求失败',
        })
        reject(data.data && data.data.msg)
      }
    }).catch(error => {
      Toast({
        duration: 1000, // 持续展示 toast
        forbidClick: true,
        message: error || '请求错误',
      })
      reject(error)
    })
  })
}

/*
 *  post请求
 *  url:请求地址
 *  params: json对象
 * */
export function post (url, params) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params
      // headers: { 'Authorization': `${global.token}` }
    }).then(response => {
      const { data } = response
      console.log(response, 'response')
      if (data.code == 0||data.code == 200) {
        resolve(data.data)
      } else {
        Toast({
          duration: 1000, // 持续展示 toast
          forbidClick: true,
          message: response.msg || '请求失败',
        })
        reject(data.data && data.data.msg)
      }
    }).catch(error => {
      console.log(error, 'error')
      Toast({
        duration: 1000, // 持续展示 toast
        forbidClick: true,
        message: '请求失败',
      })
      reject(error)
    })
  })
}

export default {
  get,
  post
}
