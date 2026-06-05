<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="日期和时间联动选择" id="datetime-picker" doc="datetime-picker">

      <demo-block title="基础用法" code="&lt;w-date-time-picker v-model=&quot;form.datetime&quot; /&gt;"><w-date-time-picker v-model="form.datetime" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'DateTime Picker 日期时间选择器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
