<template>
  <w-button size="small" @click="toggle">
    <w-icon :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" size="small" />
  </w-button>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isFullscreen = ref(false)

function isEnabled() {
  return !!document.documentElement.requestFullscreen
}

function toggle() {
  if (!isEnabled()) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

function onChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onChange)
})
</script>
