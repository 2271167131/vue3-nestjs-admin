<template>
  <div class="layout-container">
    <!-- 左侧可折叠侧边栏 -->
    <aside 
      class="sidebar" 
      :style="{ width: isCollapse ? '64px' : '220px' }"
    >
      <!-- 折叠按钮 -->
      <div class="sidebar-header">
        <el-button 
          :icon="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" 
          circle 
          size="small" 
          @click="isCollapse = !isCollapse"
          class="collapse-btn"
        ></el-button>
      </div>
      <el-menu
        :default-active="$route.path"
        class="sidebar-menu"
        router
        :collapse="isCollapse"
        style="border-right: none; height: 100%;"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/user-list">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/change-pwd">
          <el-icon><Lock /></el-icon>
          <span>修改密码</span>
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><UserFilled /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 右侧主内容区 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <div class="header">
        <span class="welcome-text">欢迎：{{ username }}</span>
        <div class="header-buttons">
          <el-button type="primary" plain size="small" @click="$router.push('/profile')">个人中心</el-button>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </div>

      <!-- 页面内容：这里渲染子路由 -->
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { House, User, Lock, UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref('')
const isCollapse = ref(false)

onMounted(() => {
  username.value = localStorage.getItem('username') || 'admin'
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #f5f7fa;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s ease;
  height: 100%;
  flex-shrink: 0;
  padding-top: 20px;
}

.sidebar-header {
  padding: 0 10px 10px;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  background: #f5f7fa;
  border: 1px solid #e6e6e6;
  cursor: pointer;
}

.sidebar-menu {
  --el-menu-text-color: #333;
  --el-menu-active-text-color: #409eff;
  height: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background: #fff;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  flex-shrink: 0;
}

.welcome-text {
  color: #666;
  font-size: 14px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>