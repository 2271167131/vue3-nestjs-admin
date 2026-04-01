<template>
  <div class="home-page">
    <h1>欢迎回来，{{ username }}!</h1>
    <p>登录成功！您现在已进入后台管理系统首页</p>
    <el-button type="primary" @click="$router.push('/user-list')">查看用户列表</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref('')
onMounted(() => {
  username.value = localStorage.getItem('username') || 'admin'
})
</script>

<style scoped>
.home-page {
  text-align: center;
  padding-top: 10%;
}
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}
p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}
</style>