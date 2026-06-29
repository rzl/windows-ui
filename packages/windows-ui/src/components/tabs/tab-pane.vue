<template>
  <div v-show="isActive" class="w-tabs__pane">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'WTabPane' })
const props = defineProps({
  label: String,
  name: { type: [String, Number], required: true },
  icon: String,
  disabled: Boolean
})
const tabs = inject<any>('tabs', null)
const isActive = computed(() => tabs ? tabs.activeName.value === props.name : false)

onMounted(() => tabs?.register({ label: props.label, name: props.name, icon: props.icon, disabled: props.disabled }))
onUnmounted(() => tabs?.unregister(props.name))
</script>

<style scoped>
.w-tabs__pane { padding: 12px; }
</style>
