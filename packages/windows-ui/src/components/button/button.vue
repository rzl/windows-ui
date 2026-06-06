<template>
  <button
    :class="['w-button', `w-button--${type}`, `w-button--${size}`, { 'is-plain': plain, 'is-round': round, 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <w-icon v-if="icon" :name="icon" />
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WButton' })
const props = defineProps({
  type: { type: String, default: 'default' },
  size: { type: String, default: undefined },
  plain: Boolean,
  round: Boolean,
  disabled: Boolean,
  icon: String
})
const emit = defineEmits(['click'])
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const handleClick = (e: MouseEvent) => { if (!props.disabled) emit('click', e) }
</script>

<style scoped>
.w-button {
  font-family: var(--w-font-family);
  font-size: var(--w-font-size-base);
  padding: 3px 12px;
  border: 1px solid #003c74;
  border-radius: var(--w-border-radius-base);
  background: linear-gradient(180deg, #fff 0%, #ecebe5 50%, #d6d0c5 100%);
  color: #000;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: var(--w-component-size);
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.8), inset -1px -1px 0 rgba(0,0,0,0.1);
}
.w-button:hover { border-color: #0078d7; background: linear-gradient(180deg, #fff 0%, #f0f8ff 50%, #d6e8f5 100%); }
.w-button:active { background: linear-gradient(180deg, #d6d0c5 0%, #ecebe5 50%, #fff 100%); box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); }
.w-button--primary { background: linear-gradient(180deg, var(--w-color-primary-light) 0%, var(--w-color-primary) 50%, var(--w-color-primary-dark) 100%); color: #fff; border-color: var(--w-color-primary-darker); }
.w-button--primary:hover { background: linear-gradient(180deg, var(--w-color-primary-lighter) 0%, var(--w-color-primary-light) 50%, var(--w-color-primary) 100%); }
.w-button--success { background: linear-gradient(180deg, var(--w-color-success-light) 0%, var(--w-color-success) 50%, var(--w-color-success-dark) 100%); color: #fff; border-color: var(--w-color-success-darker); }
.w-button--warning { background: linear-gradient(180deg, var(--w-color-warning-light) 0%, var(--w-color-warning) 50%, var(--w-color-warning-dark) 100%); color: #000; border-color: var(--w-color-warning-darker); }
.w-button--danger { background: linear-gradient(180deg, var(--w-color-danger-light) 0%, var(--w-color-danger) 50%, var(--w-color-danger-dark) 100%); color: #fff; border-color: var(--w-color-danger-darker); }
.w-button--info { background: linear-gradient(180deg, var(--w-color-info-light) 0%, var(--w-color-info) 50%, var(--w-color-info-dark) 100%); color: #fff; border-color: var(--w-color-info-darker); }
.w-button.is-plain { background: #fff; color: #000; border-color: #003c74; }
.w-button.is-round { border-radius: 16px; }
.w-button.is-disabled { opacity: 0.5; cursor: not-allowed; }
.w-button--small { padding: 2px 8px; font-size: var(--w-font-size-small); height: var(--w-component-size-small); }
.w-button--large { padding: 5px 16px; font-size: var(--w-font-size-medium); height: var(--w-component-size-large); }
</style>
