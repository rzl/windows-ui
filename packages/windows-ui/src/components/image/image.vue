<template>
  <div class="w-image">
    <img :src="src" :alt="alt" :style="imgStyle" @load="loading = false" @error="loading = false" @click="previewable && (showPreview = true)" />
    <div v-if="loading" class="w-image__placeholder"><w-icon name="loading" /><span>加载中...</span></div>
    <div v-if="showPreview" class="w-image__preview" @click="showPreview = false"><img :src="src" :alt="alt" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WImage' })
const props = defineProps({ src: String, alt: String, width: [String, Number], height: [String, Number], previewable: Boolean })
const loading = ref(true)
const showPreview = ref(false)
const imgStyle = computed(() => { const style: Record<string, string> = {}; if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width; if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height; return style })
</script>

<style scoped>
.w-image { position: relative; display: inline-block; }
.w-image img { display: block; }
.w-image__placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f0f0f0; color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); }
.w-image__preview { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
.w-image__preview img { max-width: 90%; max-height: 90%; }
</style>
