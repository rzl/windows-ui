<template>
  <div class="w-upload">
    <div class="w-upload__trigger" @click="handleClick">
      <input ref="inputRef" type="file" :accept="accept" :multiple="multiple" style="display:none" @change="handleChange" />
      <slot><w-button>{{ buttonText }}</w-button></slot>
    </div>
    <div v-if="fileList.length" class="w-upload__list">
      <div v-for="(file, i) in fileList" :key="i" class="w-upload__item"><w-icon name="file" size="small" /><span class="w-upload__name">{{ file.name }}</span><span class="w-upload__size">({{ formatSize(file.size) }})</span><w-icon name="close" size="small" class="w-upload__remove" @click="remove(i)" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WUpload' })
const props = defineProps({ accept: String, multiple: Boolean, buttonText: { type: String, default: '选择文件' } })
const emit = defineEmits(['change', 'remove'])
const inputRef = ref<HTMLInputElement>()
const fileList = ref<File[]>([])
const handleClick = () => inputRef.value?.click()
const handleChange = (e: Event) => { const files = Array.from((e.target as HTMLInputElement).files || []); if (props.multiple) fileList.value.push(...files); else fileList.value = files; emit('change', props.multiple ? fileList.value : fileList.value[0]) }
const remove = (i: number) => { fileList.value.splice(i, 1); emit('remove', i); if (inputRef.value) inputRef.value.value = '' }
const formatSize = (size: number) => { if (size < 1024) return size + ' B'; if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'; return (size / (1024 * 1024)).toFixed(1) + ' MB' }
</script>

<style scoped>
.w-upload__list { margin-top: 6px; }
.w-upload__item { display: flex; align-items: center; gap: 4px; padding: 4px; background: #f8f8f8; border: 1px solid #d4d0c8; margin-bottom: 2px; font-size: var(--w-font-size-base); }
.w-upload__name { flex: 1; }
.w-upload__size { color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); }
.w-upload__remove { cursor: pointer; }
</style>
