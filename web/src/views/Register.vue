<template>
    <div class="register-container">
        <div class="register-box">
            <h2>用户注册</h2>
            <!-- 带校验的注册表单 -->
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px" status-icon>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username" placeholder="请输入用户名" autocomplete="off" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" autocomplete="off" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleRegister" style="width: 100%" :loading="isLoading"
                        :disabled="isLoading">
                        注册
                    </el-button>
                </el-form-item>

                <!-- 跳转到登录页 -->
                <div class="go-login">
                    已有账号？<a @click="goToLogin">立即登录</a>
                </div>
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
const registerFormRef = ref(null)
const isLoading = ref(false)

// 注册表单数据
const registerForm = ref({
    username: '',
    password: ''
})

// 注册表单校验规则
const registerRules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ]
})

// 注册方法
const handleRegister = async () => {
    // 先做前端校验
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    isLoading.value = true
    try {
        // 调用后端注册接口
        await request.post('/users/register', registerForm.value)
        ElMessage.success('注册成功！即将跳转到登录页')
        // 注册成功后跳登录
        setTimeout(() => {
            router.push('/login')
        }, 1500)
    } catch (err) {
        const msg = err.response?.data?.message || '注册失败：用户名已存在或格式错误'
        ElMessage.error(msg)
    } finally {
        isLoading.value = false
    }
}

// 跳转到登录页
const goToLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
/* 样式和登录页保持一致，体验统一 */
.register-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f0f2f5;
    margin: 0;
    padding: 0;
}

.register-box {
    width: 400px;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 20px;
    font-weight: 600;
}

.go-login {
    text-align: center;
    margin-top: 20px;
    color: #666;
}

.go-login a {
    color: #409eff;
    cursor: pointer;
    text-decoration: none;
}

.go-login a:hover {
    color: #66b1ff;
}
</style>