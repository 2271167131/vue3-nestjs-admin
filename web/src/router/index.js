import { createRouter, createWebHistory } from 'vue-router'
// 导入所有组件（核对路径！文件名大小写必须一致）
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Layout from '@/views/Layout.vue' // 关键：导入Layout组件
import Home from '@/views/Home.vue'
import UserList from '@/views/UserList.vue'
import Profile from '@/views/Profile.vue'
import ChangePwd from '@/views/ChangePwd.vue'

const routes = [
  // 登录/注册页（不嵌套Layout）
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  // 后台主布局（嵌套所有功能页）
  {
    path: '/',
    component: Layout, // 关键：使用Layout组件
    beforeEnter: (to, from, next) => {
      // 登录守卫：未登录跳登录页
      const token = localStorage.getItem('token')
      token ? next() : next('/login')
    },
    // 嵌套路由：所有子页面显示在Layout的router-view里
    children: [
      { path: '', component: Home }, // 首页
      { path: 'user-list', component: UserList }, // 用户管理
      { path: 'profile', component: Profile }, // 个人信息
      { path: 'change-pwd', component: ChangePwd } // 修改密码
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router