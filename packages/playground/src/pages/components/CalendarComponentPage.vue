<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="日历展示" id="calendar" doc="calendar">

      <demo-block title="基础用法" code="&lt;w-calendar v-model=&quot;form.date&quot; :events=&quot;calendarEvents&quot; /&gt;"><w-calendar v-model="form.date" :events="calendarEvents" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Calendar 日历'
const form = reactive({ date: new Date() })
const calendarEvents = [
  { date: '2024-01-01', title: '元旦' },
  { date: '2024-01-15', title: '会议' },
]
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
