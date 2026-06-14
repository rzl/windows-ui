<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('日历展示')" id="calendar" doc="calendar">

      <demo-block :title="t('基础用法')" :code="CalendarCode1"><w-calendar v-model="form.date" :events="calendarEvents" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const title = t('Calendar 日历')
const form = reactive({ date: new Date() })
const calendarEvents = [
  { date: '2024-01-01', title: t('元旦') },
  { date: '2024-01-15', title: t('会议') },
]

const CalendarCode1 = `<w-calendar v-model="form.date" :events="calendarEvents" />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
