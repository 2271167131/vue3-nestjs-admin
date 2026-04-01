import request from '@/utils/request'

// 注册接口
export const register = (data) => {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}

// 登录接口
export const login = (data) => {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}