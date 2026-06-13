<template>
  <div class="login-page">
    <w-card class="login-box" header="低代码管理平台">
      <w-form :model="form">
        <w-form-item label="用户名">
          <w-input v-model="form.username" placeholder="请输入用户名" />
        </w-form-item>
        <w-form-item label="密码">
          <w-input v-model="form.password" type="password" placeholder="请输入密码" @keyup.enter="handleLogin" />
        </w-form-item>
        <div class="login-actions">
          <w-button type="primary" :loading="loading" @click="handleLogin">登录</w-button>
        </div>
      </w-form>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: 'admin'
})

async function handleLogin() {
  if (!form.username || !form.password) {
    alert('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await auth.login(form)
    await auth.fetchProfile()
    router.push('/')
  } catch (e: any) {
    alert(e.message || '登录失败')
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
  background: var(--w-bg-color);
}
.login-box {
  width: 360px;
}
.login-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
