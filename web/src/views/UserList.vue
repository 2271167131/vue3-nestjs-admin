<template>
  <div class="user-list-page">
    <div class="page-header">
      <h1>用户管理</h1>
      <div>
        <el-input
          v-model="keyword"
          placeholder="搜索用户名"
          clearable
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" plain @click="handleSearch" style="margin-right: 10px">搜索</el-button>
        <el-button type="success" @click="$router.push('/register')">新增用户</el-button>
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
      </div>
    </div>
    <el-table :data="userList" border style="width: 100%; margin-top: 20px;">
      <el-table-column label="序号" width="80">
        <template #default="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column label="创建时间" width="200">
        <template #default="scope">{{ formatDate(scope.row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="更新时间" width="200">
        <template #default="scope">{{ formatDate(scope.row.updatedAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            :disabled="!canDelete"
            :title="canDelete ? '' : '无权限'"
            @click="deleteUser(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: flex-end; margin-top: 16px">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        :page-sizes="[5, 10, 20, 50]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const userList = ref([])
const canDelete = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return String(val)

  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const fetchUsers = async () => {
  const res = await request.get('/users/list', {
    params: {
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value,
    },
  })
  userList.value = res.list || []
  total.value = Number(res.total || 0)
}

onMounted(() => {
  request
    .get('/auth/permissions')
    .then((perms) => {
      canDelete.value = Array.isArray(perms) && perms.includes('system:user:delete')
    })
    .catch(() => {
      canDelete.value = false
    })
    .finally(() => {
      fetchUsers()
    })
})

const handleSearch = () => {
  page.value = 1
  fetchUsers()
}

const handlePageChange = (p) => {
  page.value = p
  fetchUsers()
}

const handleSizeChange = (s) => {
  pageSize.value = s
  page.value = 1
  fetchUsers()
}

const deleteUser = async (id) => {
  await request.delete(`/users/${id}`)
  ElMessage.success('删除成功')
  await fetchUsers()
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