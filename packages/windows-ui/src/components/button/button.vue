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
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WButton' })
const props = defineProps({
  type: { type: String, default: 'default' },
  size: { type: String, default: 'default' },
  plain: Boolean,
  round: Boolean,
  disabled: Boolean,
  icon: String
})
const emit = defineEmits(['click'])
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
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.8), inset -1px -1px 0 rgba(0,0,0,0.1);
}
.w-button:hover { border-color: #0078d7; background: linear-gradient(180deg, #fff 0%, #f0f8ff 50%, #d6e8f5 100%); }
.w-button:active { background: linear-gradient(180deg, #d6d0c5 0%, #ecebe5 50%, #fff 100%); box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); }
.w-button--primary { background: linear-gradient(180deg, #3d6df5 0%, #245edb 50%, #1a5dc6 100%); color: #fff; border-color: #1034a6; }
.w-button--primary:hover { background: linear-gradient(180deg, #5a84ff 0%, #3d6df5 50%, #245edb 100%); }
.w-button--success { background: linear-gradient(180deg, #5ac45a 0%, #3a9e3a 50%, #2a8a2a 100%); color: #fff; border-color: #1a6a1a; }
.w-button--warning { background: linear-gradient(180deg, #f0c040 0%, #e4a010 50%, #c48810 100%); color: #000; border-color: #a07010; }
.w-button--danger { background: linear-gradient(180deg, #e84a4a 0%, #d92b2b 50%, #b81818 100%); color: #fff; border-color: #900808; }
.w-button--info { background: linear-gradient(180deg, #a0a0a0 0%, #808080 50%, #606060 100%); color: #fff; border-color: #404040; }
.w-button.is-plain { background: #fff; color: #000; border-color: #003c74; }
.w-button.is-round { border-radius: 16px; }
.w-button.is-disabled { opacity: 0.5; cursor: not-allowed; }
.w-button--small { padding: 2px 8px; font-size: var(--w-font-size-small); }
.w-button--large { padding: 5px 16px; font-size: var(--w-font-size-medium); }
</style>
