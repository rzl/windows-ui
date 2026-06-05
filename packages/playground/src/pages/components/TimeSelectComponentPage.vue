<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="固定间隔时间选择" id="time-select" doc="time-select">

      <demo-block title="基础用法" code="&lt;w-time-select v-model=&quot;form.timeselect&quot; /&gt;"><w-time-select v-model="form.timeselect" /></demo-block>
      <demo-block title="自定义步长" code="&lt;w-time-select v-model=&quot;form.timeselect&quot; step=&quot;01:00&quot; /&gt;"><w-time-select v-model="form.timeselect" step="01:00" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Time Select 时间选择'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
