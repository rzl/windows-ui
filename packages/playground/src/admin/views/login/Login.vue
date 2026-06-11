<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <w-icon name="computer" size="large" />
        <span>Windows UI Admin</span>
      </div>
      <div class="login-body">
        <w-form :model="form" @submit="handleLogin">
          <w-form-item label="用户名">
            <w-input v-model="form.username" placeholder="请输入用户名" prefix-icon="user" />
          </w-form-item>
          <w-form-item label="密码">
            <w-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="lock" />
          </w-form-item>
          <w-form-item label="验证码">
            <div class="captcha-row">
              <w-input v-model="form.captcha" placeholder="请输入验证码" style="flex:1" />
              <div class="captcha-code" @click="refreshCaptcha">{{ captcha }}</div>
            </div>
          </w-form-item>
          <w-form-item label=" ">
            <w-checkbox v-model="form.remember">记住密码</w-checkbox>
          </w-form-item>
          <w-form-item label=" ">
            <w-button type="primary" :loading="loading" style="width:100%" @click="handleLogin">登 录</w-button>
          </w-form-item>
        </w-form>
        <div class="login-tips">
          <p>测试账号：admin / admin（全部权限）</p>
          <p>测试账号：editor / editor（编辑权限）</p>
          <p>测试账号：viewer / viewer（只读权限）</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const captcha = ref('')

const form = reactive({
  username: 'admin',
  password: 'admin',
  captcha: '',
  remember: false
})

function refreshCaptcha() {
  captcha.value = String(Math.floor(Math.random() * 9000) + 1000)
}
refreshCaptcha()

async function handleLogin() {
  if (!form.username || !form.password) {
    alert('请输入用户名和密码')
    return
  }
  if (form.captcha !== captcha.value) {
    alert('验证码错误')
    refreshCaptcha()
    return
  }
  loading.value = true
  try {
    await auth.login({ username: form.username, password: form.password })
    router.push('/')
  } catch (e: any) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #245edb 0%, #1a4ab5 100%);
}
.login-box {
  width: 400px;
  background: var(--w-bg-color);
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: 4px 4px 12px rgba(0,0,0,0.3);
}
.login-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--w-xp-title-bar);
  color: #fff;
  font-weight: bold;
  font-size: 16px;
}
.login-body {
  padding: 24px;
}
.captcha-row {
  display: flex;
  gap: 8px;
}
.captcha-code {
  width: 80px;
  height: var(--w-component-size);
  line-height: var(--w-component-size);
  text-align: center;
  background: #f0f0f0;
  border: 1px solid #7f9db9;
  font-weight: bold;
  letter-spacing: 4px;
  cursor: pointer;
  user-select: none;
}
.login-tips {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #d4d0c8;
  font-size: 12px;
  color: #666;
}
.login-tips p {
  margin: 4px 0;
}
</style>
