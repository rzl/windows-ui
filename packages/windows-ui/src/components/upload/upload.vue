<template>
  <div :class="['w-upload', `w-upload--${size}`]">
    <div class="w-upload__trigger" @click="handleClick">
      <input ref="inputRef" type="file" :accept="accept" :multiple="multiple" style="display:none" @change="handleChange" />
      <slot><w-button :size="size" :loading="uploading">{{ buttonText }}</w-button></slot>
    </div>
    <div v-if="fileList.length" class="w-upload__list">
      <div v-for="(file, i) in fileList" :key="i" class="w-upload__item">
        <w-icon name="file" :size="size" />
        <a v-if="file.url" :href="file.url" target="_blank" class="w-upload__name">{{ file.name }}</a>
        <span v-else class="w-upload__name">{{ file.name }}</span>
        <span class="w-upload__size">({{ formatSize(file.size) }})</span>
        <w-icon v-if="!file.loading" name="close" :size="size" class="w-upload__remove" @click="remove(i)" />
        <span v-else class="w-upload__loading">上传中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WUpload' })

const props = defineProps({
  accept: String,
  multiple: Boolean,
  buttonText: { type: String, default: '选择文件' },
  size: { type: String, default: undefined },
  action: { type: String, default: '' },
  headers: { type: Object, default: () => ({}) },
  modelValue: { type: [String, Array] as PropType<string | string[]>, default: () => '' },
  httpRequest: {
    type: Function as PropType<(file: File) => Promise<{ url: string; name: string; size?: number }>>,
    default: undefined
  }
})

const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['change', 'remove', 'success', 'error', 'update:modelValue'])
const inputRef = ref<HTMLInputElement>()
const fileList = ref<{ file?: File; name: string; url?: string; size?: number; loading?: boolean }[]>([])
const uploading = computed(() => fileList.value.some((f) => f.loading))

function initFileList(value: string | string[]) {
  const urls = Array.isArray(value) ? value : value ? [value] : []
  fileList.value = urls.map((url) => ({
    name: String(url).split('/').pop() || String(url),
    url: String(url)
  }))
}

watch(() => props.modelValue, initFileList, { immediate: true })

const handleClick = () => inputRef.value?.click()

const handleChange = async (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  if (!files.length) return

  if (props.multiple) {
    for (const file of files) {
      await uploadFile(file)
    }
  } else {
    fileList.value = []
    await uploadFile(files[0])
  }

  if (inputRef.value) inputRef.value.value = ''
  emitValue()
}

async function uploadFile(file: File) {
  const item = { file, name: file.name, size: file.size, loading: true, url: undefined as string | undefined }
  fileList.value.push(item)

  try {
    const result = props.httpRequest
      ? await props.httpRequest(file)
      : await defaultUpload(file)
    item.url = result.url
    item.name = result.name || file.name
    item.size = result.size ?? file.size
    item.loading = false
    emit('success', result)
  } catch (error) {
    item.loading = false
    emit('error', error)
  }
}

async function defaultUpload(file: File): Promise<{ url: string; name: string; size: number }> {
  if (!props.action) throw new Error('未配置上传地址')
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(props.action, {
    method: 'POST',
    headers: props.headers as HeadersInit,
    body: formData
  })
  const data = await res.json()
  if (!res.ok || data.code !== 200) throw new Error(data.message || '上传失败')
  return data.data
}

function emitValue() {
  const value = props.multiple
    ? fileList.value.filter((f) => f.url).map((f) => f.url as string)
    : fileList.value[0]?.url || ''
  emit('change', value)
  emit('update:modelValue', value)
}

const remove = (i: number) => {
  fileList.value.splice(i, 1)
  emit('remove', i)
  emitValue()
}

const formatSize = (size?: number) => {
  if (size === undefined) return ''
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.w-upload__list { margin-top: 6px; }
.w-upload__item { display: flex; align-items: center; gap: 4px; padding: 4px; background: #f8f8f8; border: 1px solid #d4d0c8; margin-bottom: 2px; font-size: var(--w-font-size-base); }
.w-upload--small .w-upload__item { padding: 2px; font-size: var(--w-font-size-small); }
.w-upload--large .w-upload__item { padding: 6px; font-size: var(--w-font-size-medium); }
.w-upload__name { flex: 1; color: var(--w-color-primary); text-decoration: underline; cursor: pointer; }
.w-upload__name:hover { color: var(--w-color-primary-dark); }
.w-upload__size { color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); }
.w-upload__remove { cursor: pointer; }
.w-upload__loading { color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); }
</style>
