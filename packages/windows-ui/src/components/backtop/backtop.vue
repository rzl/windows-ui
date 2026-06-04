<template>
  <transition name="w-backtop-fade">
    <div v-show="visible" class="w-backtop" @click="scrollToTop">
      <w-icon name="arrowUp" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WBacktop' })
const props = defineProps({ visibilityHeight: { type: Number, default: 200 } })

const visible = ref(false)

const handleScroll = () => { visible.value = window.scrollY > props.visibilityHeight }
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => { window.addEventListener('scroll', handleScroll); handleScroll() })
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.w-backtop { position: fixed; right: 40px; bottom: 40px; width: 36px; height: 36px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: var(--w-index-top); box-shadow: var(--w-box-shadow); }
.w-backtop:hover { background: #f0f8ff; }
.w-backtop-fade-enter-active, .w-backtop-fade-leave-active { transition: opacity 0.3s; }
.w-backtop-fade-enter-from, .w-backtop-fade-leave-to { opacity: 0; }
</style>
