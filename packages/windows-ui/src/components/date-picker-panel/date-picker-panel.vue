<template>
  <div class="w-date-picker-panel">
    <div class="w-date-picker-panel__header">
      <div class="w-date-picker-panel__header-left">
        <w-button size="small" @click="prevYear">&lt;&lt;</w-button>
        <w-button size="small" @click="prevMonth">&lt;</w-button>
      </div>
      <span>{{ currentYear }}年 {{ currentMonth + 1 }}月</span>
      <div class="w-date-picker-panel__header-right">
        <w-button size="small" @click="nextMonth">&gt;</w-button>
        <w-button size="small" @click="nextYear">&gt;&gt;</w-button>
      </div>
    </div>
    <div class="w-date-picker-panel__weekdays">
      <span v-for="d in weekdays" :key="d">{{ d }}</span>
    </div>
    <div class="w-date-picker-panel__days">
      <span v-for="day in days" :key="day.key" :class="['w-date-picker-panel__day', { 'is-current': day.current, 'is-today': day.today, 'is-selected': isSelected(day) }]" @click="selectDay(day)">{{ day.date }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WButton from '../button/button.vue'
defineOptions({ name: 'WDatePickerPanel' })
const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue', 'change'])
const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())
const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const days = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startOffset = firstDay.getDay()
  const prevLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const result: any[] = []
  for (let i = startOffset - 1; i >= 0; i--) result.push({ date: prevLastDay - i, current: false, key: `p${prevLastDay - i}` })
  for (let i = 1; i <= lastDay.getDate(); i++) { const isToday = now.getFullYear() === currentYear.value && now.getMonth() === currentMonth.value && now.getDate() === i; result.push({ date: i, current: true, today: isToday, key: `c${i}` }) }
  const remaining = 42 - result.length
  for (let i = 1; i <= remaining; i++) result.push({ date: i, current: false, key: `n${i}` })
  return result
})
const isSelected = (day: any) => {
  if (!props.modelValue || !day.current) return false
  const [y, m, d] = props.modelValue.split('-').map(Number)
  return y === currentYear.value && m === currentMonth.value + 1 && d === day.date
}
const selectDay = (day: any) => { if (!day.current) return; const val = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`; emit('update:modelValue', val); emit('change', val) }
const prevMonth = () => { if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- } else currentMonth.value-- }
const nextMonth = () => { if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ } else currentMonth.value++ }
const prevYear = () => { currentYear.value-- }
const nextYear = () => { currentYear.value++ }
</script>

<style scoped>
.w-date-picker-panel { width: 240px; background: var(--w-bg-color); border: 1px solid #808080; padding: 8px; }
.w-date-picker-panel__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: var(--w-font-size-base); font-weight: bold; }
.w-date-picker-panel__header-left { display: flex; gap: 4px; }
.w-date-picker-panel__header-right { display: flex; gap: 4px; }
.w-date-picker-panel__weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: var(--w-font-size-small); color: #666; margin-bottom: 4px; }
.w-date-picker-panel__days { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
.w-date-picker-panel__day { padding: 4px; cursor: pointer; font-size: var(--w-font-size-base); }
.w-date-picker-panel__day:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-date-picker-panel__day.is-today { font-weight: bold; color: var(--w-color-primary); }
.w-date-picker-panel__day.is-selected { background: var(--w-color-primary); color: #fff; }
.w-date-picker-panel__day:not(.is-current) { color: #a0a0a0; }
</style>
