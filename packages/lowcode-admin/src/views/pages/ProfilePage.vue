<template>
  <div class="profile-page">
    <w-card header="基本信息">
      <w-form ref="profileFormRef" :model="form" :rules="profileRules">
        <div class="avatar-row">
          <w-avatar
            :src="form.avatar"
            :alt="auth.userInfo?.nickname"
            size="large"
            class="profile-avatar"
            @click="triggerUpload"
          />
          <w-button size="small" @click="triggerUpload">修改头像</w-button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        <w-form-item label="用户名" prop="username">
          <w-input :model-value="auth.userInfo?.username" disabled />
        </w-form-item>
        <w-form-item label="昵称" prop="nickname">
          <w-input v-model="form.nickname" placeholder="请输入昵称" />
        </w-form-item>
        <w-form-item label="邮箱" prop="email">
          <w-input v-model="form.email" placeholder="请输入邮箱" />
        </w-form-item>
        <w-form-item label="手机号" prop="phone">
          <w-input v-model="form.phone" placeholder="请输入手机号" />
        </w-form-item>
        <w-form-item label="">
          <w-button type="primary" :loading="loading" @click="saveProfile">保存</w-button>
        </w-form-item>
      </w-form>
    </w-card>

    <w-card header="修改密码" style="margin-top: 16px">
      <w-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
        <w-form-item label="原密码" prop="oldPassword">
          <w-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
        </w-form-item>
        <w-form-item label="新密码" prop="newPassword">
          <w-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
        </w-form-item>
        <w-form-item label="确认密码" prop="confirmPassword">
          <w-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </w-form-item>
        <w-form-item label="">
          <w-button type="primary" :loading="passwordLoading" @click="savePassword">修改密码</w-button>
        </w-form-item>
      </w-form>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as authApi from '@/api/auth'
import type { FormRule } from '@windows-ui/core'

const auth = useAuthStore()

const profileFormRef = ref<any>(null)
const passwordFormRef = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  nickname: '',
  email: '',
  phone: '',
  avatar: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const passwordLoading = ref(false)

const profileRules: Record<string, FormRule[]> = {
  nickname: [{ max: 50, message: '昵称最多 50 个字符' }],
  email: [{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }]
}

const passwordRules: Record<string, FormRule[]> = {
  oldPassword: [{ required: true, message: '请输入原密码' }],
  newPassword: [{ required: true, min: 6, message: '新密码至少 6 位' }],
  confirmPassword: [
    { required: true, message: '请再次输入新密码' },
    {
      validator: (_value: any) =>
        passwordForm.confirmPassword === passwordForm.newPassword || '两次输入密码不一致'
    }
  ]
}

function initForm() {
  const u = auth.userInfo || {}
  form.nickname = u.nickname || ''
  form.email = u.email || ''
  form.phone = u.phone || ''
  form.avatar = u.avatar || ''
}

onMounted(async () => {
  if (!auth.userInfo) {
    await auth.fetchProfile()
  }
  initForm()
})

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const res = await authApi.uploadAvatar(file)
    form.avatar = res.url
    alert('头像上传成功')
  } catch (err: any) {
    alert(err.message || '头像上传失败')
  }
}

async function saveProfile() {
  const valid = await profileFormRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    await authApi.updateProfile({ ...form })
    await auth.fetchProfile()
    initForm()
    alert('个人信息保存成功')
  } catch (err: any) {
    alert(err.message || '保存失败')
  } finally {
    loading.value = false
  }
}

async function savePassword() {
  const valid = await passwordFormRef.value?.validate()
  if (!valid) return

  passwordLoading.value = true
  try {
    await authApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    alert('密码修改成功')
  } catch (err: any) {
    alert(err.message || '密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped>
.profile-page { padding: 8px; }
.avatar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-left: 100px;
}
.profile-avatar { cursor: pointer; }
</style>
