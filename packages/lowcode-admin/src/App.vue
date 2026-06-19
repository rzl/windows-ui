<template>
  <w-config-provider :size="app.size" :theme="app.theme" :locale="app.locale">
    <router-view />
  </w-config-provider>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { loadVConsole, destroyVConsole } from '@/utils/vconsole'

const app = useAppStore()

watch(() => app.vconsoleEnabled, (enabled) => {
  if (enabled) {
    loadVConsole()
  } else {
    destroyVConsole()
  }
}, { immediate: true })
</script>
