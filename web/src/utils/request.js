import axios from 'axios'

const request = axios.create({
  // 1. 必须是后端地址：http://localhost:3000
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('发送请求：', config) // 打印请求，排查问题
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  res => {
    console.log('收到响应：', res) // 打印响应，排查问题
    return res.data
  },
  error => {
    console.error('响应错误：', error) // 打印错误，排查问题
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request