<template>
  <div class="error-page">
    <w-result
      icon="warning"
      title="401"
      sub-title="您没有权限访问此页面"
    >
      <template #extra>
        <w-button type="primary" @click="$router.push('/')">返回首页</w-button>
        <w-button @click="$router.push('/login')">返回登录</w-button>
      </template>
    </w-result>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--w-bg-color);
}
</style>
