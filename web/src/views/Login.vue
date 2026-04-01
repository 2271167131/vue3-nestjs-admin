<template>
  <div class="login-container">
    <div class="login-box">
      <h2>后台管理系统</h2>
      <!-- 表单核心：绑定校验规则 + 状态图标 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" status-icon>
        <!-- 用户名输入框：绑定prop做校验 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" autocomplete="off" />
        </el-form-item>

        <!-- 密码输入框：绑定prop做校验 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" autocomplete="off" />
        </el-form-item>

        <!-- 登录按钮：加loading + 禁用状态 -->
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%" :loading="isLoading" :disabled="isLoading">
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="go-register">
            还没有账号？<a @click="goToRegister">立即注册</a>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
// 导入Vue核心API
import { ref } from 'vue'
// 导入路由
import { useRouter } from 'vue-router'
// 导入登录接口
import { login } from '@/api/user'
// 导入Element Plus提示组件
import { ElMessage } from 'element-plus'

// 初始化路由实例
const router = useRouter()
// 表单引用：用于触发校验
const loginFormRef = ref(null)
// 加载状态：控制按钮loading
const isLoading = ref(false)

// 表单数据：清空默认值，让用户手动输入
const loginForm = ref({
  username: '',
  password: ''
})

// 表单校验规则（核心）
const loginRules = ref({
  // 用户名校验规则
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }, // 失去焦点校验
    { min: 2, max: 10, message: '用户名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  // 密码校验规则
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

// 登录核心方法
const handleLogin = async () => {
  // 第一步：先做前端表单校验，不通过直接返回
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  // 第二步：开启loading，防止重复点击
  isLoading.value = true

  try {
    // 第三步：调用登录接口
    const res = await login(loginForm.value)

    // 第四步：登录成功 - 存储Token和用户名
    localStorage.setItem('token', res.token)
    localStorage.setItem('username', res.username)

    // 提示+跳转首页
    ElMessage.success('登录成功！即将跳转到首页')
    router.push('/')
  } catch (err) {
    // 登录失败 - 打印错误+提示用户
    console.error('登录失败详情：', err)
    ElMessage.error('账号或密码错误，请重新输入')
  } finally {
    // 第五步：无论成功/失败，都关闭loading
    isLoading.value = false
  }
}

// 新增跳转到注册页的方法
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
/* 登录页整体样式：居中+背景色 */
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
  /* 浅灰背景，符合后台系统风格 */
  margin: 0;
  padding: 0;
}

/* 登录框样式：白色卡片+阴影 */
.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  /* 轻微阴影，更立体 */
  box-sizing: border-box;
}

/* 标题样式 */
h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

/* 加样式，和注册页保持一致 */
.go-register {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.go-register a {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}

.go-register a:hover {
  color: #66b1ff;
}
</style>