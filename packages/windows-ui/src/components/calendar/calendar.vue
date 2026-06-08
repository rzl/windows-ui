<template>
  <div class="w-calendar">
    <div class="w-calendar__header">
      <w-button size="small" @click="prevMonth">&lt;</w-button>
      <span class="w-calendar__title">{{ currentYear }}年 {{ currentMonth + 1 }}月</span>
      <w-button size="small" @click="nextMonth">&gt;</w-button>
    </div>
    <div class="w-calendar__weekdays">
      <span v-for="d in weekdays" :key="d">{{ d }}</span>
    </div>
    <div class="w-calendar__days">
      <div
        v-for="day in days"
        :key="day.key"
        :class="['w-calendar__day', { 'is-current': day.current, 'is-today': day.today, 'is-selected': isSelected(day) }]"
        @click="selectDay(day)"
      >
        <span>{{ day.date }}</span>
        <div v-if="day.events?.length" class="w-calendar__events">
          <span v-for="(_, i) in day.events.slice(0, 3)" :key="i" class="w-calendar__event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import WButton from '../button/button.vue'

defineOptions({ name: 'WCalendar' })
const props = defineProps({
  modelValue: { type: [String, Date] as PropType<string | Date>, default: '' },
  events: { type: Array as () => { date: string; title: string }[], default: () => [] }
})
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
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const isToday = now.getFullYear() === currentYear.value && now.getMonth() === currentMonth.value && now.getDate() === i
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    result.push({ date: i, current: true, today: isToday, key: `c${i}`, events: props.events.filter(e => e.date === dateStr) })
  }
  const remaining = 42 - result.length
  for (let i = 1; i <= remaining; i++) result.push({ date: i, current: false, key: `n${i}` })
  return result
})

const isSelected = (day: any) => {
  if (!props.modelValue || !day.current) return false
  let dateStr: string
  if (props.modelValue instanceof Date) {
    dateStr = `${props.modelValue.getFullYear()}-${String(props.modelValue.getMonth() + 1).padStart(2, '0')}-${String(props.modelValue.getDate()).padStart(2, '0')}`
  } else {
    dateStr = String(props.modelValue)
  }
  const [y, m, d] = dateStr.split('-').map(Number)
  return y === currentYear.value && m === currentMonth.value + 1 && d === day.date
}

const selectDay = (day: any) => {
  if (!day.current) return
  const val = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
  emit('update:modelValue', val)
  emit('change', val)
}

const prevMonth = () => { if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- } else currentMonth.value-- }
const nextMonth = () => { if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ } else currentMonth.value++ }
</script>

<style scoped>
.w-calendar { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; padding: 8px; }
.w-calendar__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.w-calendar__title { font-weight: bold; font-size: var(--w-font-size-medium); }
.w-calendar__weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: var(--w-font-size-small); color: #666; margin-bottom: 4px; }
.w-calendar__days { display: grid; grid-template-columns: repeat(7, 1fr); }
.w-calendar__day { min-height: 48px; padding: 4px; cursor: pointer; border: 1px solid transparent; font-size: var(--w-font-size-base); display: flex; flex-direction: column; align-items: center; }
.w-calendar__day:hover { background: var(--w-xp-blue-light); color: #fff; }
.w-calendar__day.is-today { font-weight: bold; color: var(--w-color-primary); border-color: var(--w-color-primary); }
.w-calendar__day.is-selected { background: var(--w-color-primary); color: #fff; }
.w-calendar__day:not(.is-current) { color: #a0a0a0; background: #f0f0f0; }
.w-calendar__events { display: flex; gap: 2px; margin-top: 2px; }
.w-calendar__event { width: 4px; height: 4px; background: var(--w-color-danger); border-radius: 50%; }
</style>
