<template>
  <div ref="containerRef" class="w-infinite-scroll" @scroll="handleScroll">
    <slot />
    <div v-if="loading" class="w-infinite-scroll__loading">
      <w-icon name="loading" /> <span>加载中...</span>
    </div>
    <div v-if="noMore" class="w-infinite-scroll__finished">没有更多了</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WInfiniteScroll' })
const props = defineProps({
  loading: Boolean,
  noMore: Boolean,
  distance: { type: Number, default: 0 }
})
const emit = defineEmits(['load'])

const containerRef = ref<HTMLDivElement>()

const handleScroll = () => {
  if (!containerRef.value || props.loading || props.noMore) return
  const { scrollTop, scrollHeight, clientHeight } = containerRef.value
  if (scrollHeight - scrollTop - clientHeight <= props.distance) emit('load')
}
</script>

<style scoped>
.w-infinite-scroll { overflow-y: auto; max-height: 400px; }
.w-infinite-scroll__loading, .w-infinite-scroll__finished { text-align: center; padding: 12px; color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); }
</style>
