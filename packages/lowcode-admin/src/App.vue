<template>
  <w-config-provider :size="app.size" :theme="app.theme">
    <router-view />
  </w-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const app = useAppStore()
</script>
