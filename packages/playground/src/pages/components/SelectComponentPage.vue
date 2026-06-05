<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="下拉选择" id="select" doc="select">

      <demo-block title="基础用法" code="&lt;w-select v-model=&quot;form.select&quot; :options=&quot;selectOptions&quot; /&gt;"><w-select v-model="form.select" :options="selectOptions" /></demo-block>
      <demo-block title="虚拟化选择器" code="&lt;w-virtualized-select v-model=&quot;form.select&quot; :options=&quot;selectOptions&quot; /&gt;"><w-virtualized-select v-model="form.select" :options="selectOptions" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Select 选择器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
