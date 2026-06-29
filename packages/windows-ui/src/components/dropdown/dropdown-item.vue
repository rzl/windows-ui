<template>
  <div :class="['w-dropdown__item', { 'is-disabled': disabled }]" @click="handleClick">
    <w-icon v-if="icon" :name="icon" :size="size" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WDropdownItem' })
const props = defineProps({
  command: [String, Number, Object] as any,
  disabled: Boolean,
  icon: String
})
const dropdown = inject<any>('dropdown', null)
const size = computed(() => dropdown?.size?.value || 'default')
const handleClick = () => {
  if (props.disabled) return
  dropdown?.handleCommand(props.command)
}
</script>
