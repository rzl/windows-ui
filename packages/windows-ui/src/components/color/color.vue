<template>
  <div class="w-color">
    <div
      v-for="c in colors"
      :key="c.name"
      class="w-color__item"
      :style="{ backgroundColor: c.value }"
      :title="c.name"
      @click="handleSelect(c.value)"
    >
      <span class="w-color__label">{{ c.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WColor' })
const colors = [
  { name: 'XP Blue', value: '#245edb' },
  { name: 'XP Olive', value: '#8ba869' },
  { name: 'XP Silver', value: '#c0c0c0' },
  { name: 'Success', value: '#3a9e3a' },
  { name: 'Warning', value: '#e4a010' },
  { name: 'Danger', value: '#d92b2b' },
  { name: 'Info', value: '#808080' },
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Teal', value: '#008080' }
]
const emit = defineEmits(['select'])
const handleSelect = (v: string) => emit('select', v)
</script>

<style scoped>
.w-color { display: flex; flex-wrap: wrap; gap: 4px; }
.w-color__item { width: 48px; height: 48px; border: 1px solid #808080; cursor: pointer; display: flex; align-items: flex-end; }
.w-color__item:hover { border-color: #000; box-shadow: 0 0 4px rgba(0,0,0,0.3); }
.w-color__label { background: rgba(255,255,255,0.85); font-size: 9px; padding: 1px 2px; width: 100%; text-align: center; }
</style>
