<template>
  <div class="change-pwd-container">
    <div class="change-pwd-box">
      <h2>修改密码</h2>
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="100px"
        status-icon
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="form.oldPwd" type="password" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input v-model="form.confirmPwd" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" style="width: 100%" :loading="loading">
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const form = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})

// 校验规则
const rules = ref({
  oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }],
  confirmPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, val, cb) => val === form.value.newPwd ? cb() : cb(new Error('两次密码不一致')), trigger: 'blur' }
  ]
})

// 提交修改
const submit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await request.post('/users/change-password', {
      oldPwd: form.value.oldPwd,
      newPwd: form.value.newPwd
    })
    ElMessage.success('密码修改成功，请重新登录')
    localStorage.removeItem('token')
    router.push('/login')
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '修改失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-pwd-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}
.change-pwd-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
</style>