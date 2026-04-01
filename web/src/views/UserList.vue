<template>
  <div class="user-list-page">
    <div class="page-header">
      <h1>用户管理</h1>
      <div>
        <el-button type="success" @click="$router.push('/register')">新增用户</el-button>
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
      </div>
    </div>
    <el-table :data="userList" border style="width: 100%; margin-top: 20px;">
      <el-table-column label="序号" width="80">
        <template #default="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column label="创建时间" prop="createdAt" width="200" />
      <el-table-column label="更新时间" prop="updatedAt" width="200" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const userList = ref([
  { id: 1, username: 'admin', createdAt: '2026-04-01 15:15:40', updatedAt: '2026-04-01 16:27:46' }
])

const deleteUser = (id) => {
  userList.value = userList.value.filter(item => item.id !== id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h1 {
  font-size: 20px;
  color: #333;
  margin: 0;
}
</style>