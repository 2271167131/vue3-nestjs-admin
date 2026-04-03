<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="avatar-box">
        <el-avatar size="80" icon="el-icon-user-solid" :style="{ backgroundColor: '#409eff' }"></el-avatar>
        <h2>{{ username }}</h2>
      </div>

      <el-descriptions 
        title="账户信息" 
        :column="2"
        border 
        style="margin-top: 20px; width: 100%"
      >
        <el-descriptions-item label="用户名" width="100px">
          {{ username || '未获取到用户名' }}
        </el-descriptions-item>
        <el-descriptions-item label="登录状态">
          <el-tag type="success">已登录</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Token 有效期" width="100px">
          <el-tag type="info">2小时</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作提示">
          <span style="color: #666; font-size: 12px">退出登录后 Token 将失效，请重新登录</span>
        </el-descriptions-item>
      </el-descriptions>

      <div class="btn-group" style="margin-top: 30px">
        <el-button type="primary" @click="goBack">返回首页</el-button>
        <el-button type="danger" @click="handleLogout" style="margin-left: 10px">退出登录</el-button>
        <el-button type="warning" @click="goToChangePwd" style="margin-left: 10px">修改密码</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const username = ref('')

onMounted(() => {
  const fallback = localStorage.getItem('username') || '未知用户'
  username.value = fallback
  request
    .get('/users/profile')
    .then((res) => {
      username.value = res.username || fallback
    })
    .catch((err) => {
      console.error('获取个人信息失败：', err)
      ElMessage.error('获取个人信息失败')
    })
})

const goBack = () => {
  router.push('/')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  ElMessage.success('退出登录成功')
  router.push('/login')
}

const goToChangePwd = () => router.push('/change-pwd')
</script>

<style scoped>
.profile-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  margin: 0;
  padding: 0;
}

.profile-card {
  width: 500px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-size: 22px;
  color: #333;
  margin: 15px 0 0 0;
  font-weight: 600;
}

.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}
</style>