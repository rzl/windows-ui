<template>
  <w-select v-model="innerValue" :options="timeOptions" :placeholder="placeholder" :size="size" @change="handleChange" @clear="handleClear" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WSelect from '../select/select.vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WTimeSelect' })
const props = defineProps({ modelValue: String, placeholder: { type: String, default: '选择时间' }, start: { type: String, default: '00:00' }, end: { type: String, default: '23:59' }, step: { type: String, default: '00:30' }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['update:modelValue', 'change', 'clear'])
const innerValue = ref(props.modelValue)
watch(() => props.modelValue, (v) => { innerValue.value = v })
const timeOptions = computed(() => {
  const opts: { label: string; value: string }[] = []
  const [sh, sm] = props.start.split(':').map(Number)
  const [eh, em] = props.end.split(':').map(Number)
  const [sth, stm] = props.step.split(':').map(Number)
  let h = sh, m = sm
  const endMin = eh * 60 + em
  while (h * 60 + m <= endMin) {
    const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    opts.push({ label: val, value: val })
    m += stm
    if (m >= 60) { h += sth + Math.floor(m / 60); m = m % 60 }
    else { h += sth }
  }
  return opts
})
const handleChange = (v: string) => { emit('update:modelValue', v); emit('change', v) }
const handleClear = () => { emit('update:modelValue', ''); emit('change', ''); emit('clear') }
</script>
