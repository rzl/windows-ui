<template>
  <div class="theme-setting">
    <w-popover trigger="click" placement="bottom">
      <template #reference>
        <w-button size="small">
          <w-icon name="setting" size="small" />
        </w-button>
      </template>
      <div class="theme-panel">
        <div class="theme-row">
          <span>主题色</span>
          <input type="color" :value="app.theme.primary" @change="e => setPrimary((e.target as HTMLInputElement).value)">
        </div>
        <div class="theme-row">
          <span>组件大小</span>
          <w-space>
            <w-button v-for="s in sizes" :key="s.value" size="small" :type="app.size === s.value ? 'primary' : 'default'" @click="app.size = s.value">
              {{ s.label }}
            </w-button>
          </w-space>
        </div>
      </div>
    </w-popover>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const sizes: { label: string; value: 'small' | 'default' | 'large' }[] = [
  { label: '小', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大', value: 'large' }
]

function setPrimary(color: string) {
  app.theme = { ...app.theme, primary: color }
}
</script>

<style scoped>
.theme-panel { padding: 8px; min-width: 180px; }
.theme-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.theme-row:last-child { margin-bottom: 0; }
</style>
