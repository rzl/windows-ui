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

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: 'Tahoma', 'Microsoft Sans Serif', sans-serif;
  background: #ece9d8;
}
#app,
#app > div {
  height: 100%;
}
</style>
