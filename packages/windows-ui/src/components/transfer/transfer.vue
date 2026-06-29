<template>
  <div class="w-transfer">
    <div class="w-transfer__panel">
      <div class="w-transfer__header"><w-checkbox v-model="leftAll" :indeterminate="leftIndeterminate" @change="toggleLeftAll">{{ leftTitle }}</w-checkbox><span>{{ leftChecked.length }}/{{ leftData.length }}</span></div>
      <div class="w-transfer__body">
        <w-checkbox v-for="item in leftData" :key="item.key" v-model="leftChecked" :label="item.key" :disabled="item.disabled">{{ item.label }}</w-checkbox>
      </div>
    </div>
    <div class="w-transfer__buttons"><w-button size="small" :disabled="!leftChecked.length" @click="toRight">&gt;</w-button><w-button size="small" :disabled="!rightChecked.length" @click="toLeft">&lt;</w-button></div>
    <div class="w-transfer__panel">
      <div class="w-transfer__header"><w-checkbox v-model="rightAll" :indeterminate="rightIndeterminate" @change="toggleRightAll">{{ rightTitle }}</w-checkbox><span>{{ rightChecked.length }}/{{ rightData.length }}</span></div>
      <div class="w-transfer__body">
        <w-checkbox v-for="item in rightData" :key="item.key" v-model="rightChecked" :label="item.key" :disabled="item.disabled">{{ item.label }}</w-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WCheckbox from '../checkbox/checkbox.vue'
import WButton from '../button/button.vue'
defineOptions({ name: 'WTransfer' })
const props = defineProps({ modelValue: { type: Array as () => (string | number)[], default: () => [] }, data: { type: Array as () => { key: string | number; label: string; disabled?: boolean }[], default: () => [] }, leftTitle: { type: String, default: '待选' }, rightTitle: { type: String, default: '已选' } })
const emit = defineEmits(['update:modelValue', 'change'])
const leftChecked = ref<(string | number)[]>([])
const rightChecked = ref<(string | number)[]>([])
const leftData = computed(() => props.data.filter(d => !props.modelValue.includes(d.key)))
const rightData = computed(() => props.data.filter(d => props.modelValue.includes(d.key)))
const leftAll = computed(() => leftData.value.length > 0 && leftChecked.value.length === leftData.value.length)
const leftIndeterminate = computed(() => leftChecked.value.length > 0 && leftChecked.value.length < leftData.value.length)
const rightAll = computed(() => rightData.value.length > 0 && rightChecked.value.length === rightData.value.length)
const rightIndeterminate = computed(() => rightChecked.value.length > 0 && rightChecked.value.length < rightData.value.length)
const toggleLeftAll = (v: boolean) => { leftChecked.value = v ? leftData.value.map(d => d.key) : [] }
const toggleRightAll = (v: boolean) => { rightChecked.value = v ? rightData.value.map(d => d.key) : [] }
const toRight = () => { const val = [...props.modelValue, ...leftChecked.value]; emit('update:modelValue', val); emit('change', val); leftChecked.value = [] }
const toLeft = () => { const val = props.modelValue.filter(v => !rightChecked.value.includes(v)); emit('update:modelValue', val); emit('change', val); rightChecked.value = [] }
</script>

<style scoped>
.w-transfer { display: flex; align-items: center; gap: 8px; }
.w-transfer__panel { width: 180px; border: 1px solid #808080; background: var(--w-bg-color); }
.w-transfer__header { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-bottom: 1px solid #d4d0c8; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); font-size: var(--w-font-size-base); }
.w-transfer__body { height: 200px; overflow-y: auto; padding: 4px 8px; }
.w-transfer__body .w-checkbox { display: block; margin: 2px 0; }
.w-transfer__buttons { display: flex; flex-direction: column; gap: 4px; }
</style>
