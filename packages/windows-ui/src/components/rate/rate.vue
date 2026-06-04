<template>
  <div :class="['w-rate', { 'is-disabled': disabled }]">
    <span
      v-for="i in max"
      :key="i"
      :class="['w-rate__item', { 'is-active': i <= currentValue }]"
      @mouseenter="hoverValue = disabled ? currentValue : i"
      @mouseleave="hoverValue = currentValue"
      @click="select(i)"
    >
      <w-icon name="star" />
    </span>
    <span v-if="showScore" class="w-rate__score">{{ hoverValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WRate' })
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  disabled: Boolean,
  showScore: Boolean
})
const emit = defineEmits(['update:modelValue', 'change'])

const hoverValue = ref(props.modelValue)
const currentValue = computed(() => hoverValue.value)

const select = (i: number) => {
  if (props.disabled) return
  hoverValue.value = i
  emit('update:modelValue', i)
  emit('change', i)
}
</script>

<style scoped>
.w-rate { display: inline-flex; align-items: center; gap: 2px; }
.w-rate__item { cursor: pointer; color: #c0c0c0; }
.w-rate__item.is-active { color: #e4a010; }
.w-rate.is-disabled .w-rate__item { cursor: not-allowed; }
.w-rate__score { margin-left: 8px; font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); }
</style>
