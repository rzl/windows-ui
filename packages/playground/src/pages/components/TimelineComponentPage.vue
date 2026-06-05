<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="时间轴展示" id="timeline" doc="timeline">

      <demo-block title="基础用法" code="&lt;w-timeline :items=&quot;[{ time: '2024-01', title: '开始' }, { time: '2024-02', title: '开发', content: '核心功能', color: '#245edb' }, { time: '2024-03', title: '上线' }]&quot; /&gt;"><w-timeline :items="[{ time: '2024-01', title: '开始' }, { time: '2024-02', title: '开发', content: '核心功能', color: '#245edb' }, { time: '2024-03', title: '上线' }]" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Timeline 时间线'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
