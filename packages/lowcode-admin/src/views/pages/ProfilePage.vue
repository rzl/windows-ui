<template>
  <div class="profile-page">
    <w-card header="个人信息">
      <w-descriptions :column="2" border>
        <w-descriptions-item label="用户名">{{ auth.userInfo?.username }}</w-descriptions-item>
        <w-descriptions-item label="昵称">{{ auth.userInfo?.nickname }}</w-descriptions-item>
        <w-descriptions-item label="邮箱">{{ auth.userInfo?.email || '-' }}</w-descriptions-item>
        <w-descriptions-item label="手机号">{{ auth.userInfo?.phone || '-' }}</w-descriptions-item>
        <w-descriptions-item label="角色">{{ auth.userInfo?.roleName || '-' }}</w-descriptions-item>
        <w-descriptions-item label="部门">{{ auth.userInfo?.deptName || '-' }}</w-descriptions-item>
      </w-descriptions>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
.profile-page { padding: 8px; }
</style>
