<template>
  <div class="w-image">
    <img :src="src" :alt="alt" :style="imgStyle" @load="loading = false" @error="loading = false" @click="openPreview" />
    <div v-if="loading" class="w-image__placeholder"><w-icon name="loading" /><span>加载中...</span></div>
    <div v-if="showPreview" class="w-image__preview" @click="showPreview = false">
      <img :src="previewList[previewIndex]" :alt="alt" />
      <div v-if="previewList.length > 1" class="w-image__preview-actions">
        <span class="w-image__preview-arrow" @click.stop="previewPrev">&lt;</span>
        <span>{{ previewIndex + 1 }} / {{ previewList.length }}</span>
        <span class="w-image__preview-arrow" @click.stop="previewNext">&gt;</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WImage' })
const props = defineProps({
  src: String,
  alt: String,
  width: [String, Number],
  height: [String, Number],
  previewable: Boolean,
  previewSrcList: { type: Array as () => string[], default: () => [] }
})
const loading = ref(true)
const showPreview = ref(false)
const previewIndex = ref(0)
const previewList = computed(() => props.previewSrcList.length ? props.previewSrcList : (props.src ? [props.src] : []))
const imgStyle = computed(() => { const style: Record<string, string> = {}; if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width; if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height; return style })
const openPreview = () => {
  if (!props.previewable && !props.previewSrcList.length) return
  previewIndex.value = 0
  showPreview.value = true
}
const previewPrev = () => { previewIndex.value = (previewIndex.value - 1 + previewList.value.length) % previewList.value.length }
const previewNext = () => { previewIndex.value = (previewIndex.value + 1) % previewList.value.length }
</script>

<style scoped>
.w-image { position: relative; display: inline-block; }
.w-image img { display: block; }
.w-image__placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f0f0f0; color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); }
.w-image__preview { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
.w-image__preview img { max-width: 90%; max-height: 90%; }
.w-image__preview-actions { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; color: #fff; font-size: var(--w-font-size-base); }
.w-image__preview-arrow { cursor: pointer; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 4px; }
.w-image__preview-arrow:hover { background: rgba(255,255,255,0.4); }
</style>
