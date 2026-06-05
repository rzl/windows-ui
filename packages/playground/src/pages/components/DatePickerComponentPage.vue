<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="日期选择" id="date-picker" doc="date-picker">

      <demo-block title="基础用法" code="&lt;w-date-picker v-model=&quot;form.date&quot; /&gt;"><w-date-picker v-model="form.date" /></demo-block>
      <demo-block title="日期面板" code="&lt;w-date-picker-panel v-model=&quot;form.date2&quot; /&gt;"><w-date-picker-panel v-model="form.date2" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Date Picker 日期选择器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
