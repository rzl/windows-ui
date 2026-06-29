<template>
  <div :class="['w-collapse__item', { 'is-active': isActive }]">
    <div class="w-collapse__header" @click="toggle">
      <div class="w-collapse__header-content">
        <slot name="header">
          <w-icon :name="isActive ? 'arrowDown' : 'arrowRight'" :size="size" />
          <span>{{ title }}</span>
        </slot>
      </div>
      <div class="w-collapse__actions" @click.stop>
        <slot name="action" />
      </div>
    </div>
    <div v-show="isActive" class="w-collapse__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WCollapseItem' })
const props = defineProps({
  name: { type: [String, Number], required: true },
  title: String
})
const collapse = inject<any>('collapse', null)
const size = computed(() => collapse?.size?.value || 'default')
const isActive = computed(() => collapse ? collapse.isActive(props.name) : false)
const toggle = () => { collapse?.toggle(props.name) }
</script>
