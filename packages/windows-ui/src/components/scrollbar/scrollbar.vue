<template>
  <div ref="wrapRef" class="w-scrollbar" :style="wrapStyle">
    <div class="w-scrollbar__view"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({ name: 'WScrollbar' })
const props = defineProps({ height: { type: [String, Number], default: '' }, maxHeight: { type: [String, Number], default: '' } })
const wrapStyle = computed(() => { const style: Record<string, string> = {}; if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height; if (props.maxHeight) style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight; return style })
const wrapRef = ref<HTMLDivElement>()
</script>

<style scoped>
.w-scrollbar { overflow: auto; background: #fff; border: 1px solid #7f9db9; }
.w-scrollbar::-webkit-scrollbar { width: 16px; height: 16px; }
.w-scrollbar::-webkit-scrollbar-track { background: #f0f0f0; border-left: 1px solid #d4d0c8; }
.w-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #e8e8e8 0%, #d4d0c8 50%, #c0c0c0 100%); border: 1px solid #808080; }
.w-scrollbar__view { padding: 4px; }
</style>
