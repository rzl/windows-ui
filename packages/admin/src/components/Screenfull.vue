<template>
  <w-button size="small" @click="toggle">
    <w-icon :name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" size="small" />
  </w-button>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import screenfull from 'screenfull'

const isFullscreen = ref(false)

function toggle() {
  if (screenfull.isEnabled) {
    screenfull.toggle()
  }
}

function onChange() {
  isFullscreen.value = screenfull.isFullscreen
}

onMounted(() => {
  if (screenfull.isEnabled) {
    screenfull.on('change', onChange)
  }
})

onBeforeUnmount(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', onChange)
  }
})
</script>
