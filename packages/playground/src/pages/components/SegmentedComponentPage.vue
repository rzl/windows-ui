<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="分段选项" id="segmented" doc="segmented">

      <demo-block title="基础用法" code="&lt;w-segmented v-model=&quot;form.segment&quot; :options=&quot;[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]&quot; /&gt;"><w-segmented v-model="form.segment" :options="[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]" /></demo-block>
      <demo-block title="带图标" code="&lt;w-segmented v-model=&quot;form.segment&quot; :options=&quot;[{ label: '列表', value: 'list', icon: 'menu' }, { label: '网格', value: 'grid', icon: 'folder' }]&quot; /&gt;"><w-segmented v-model="form.segment" :options="[{ label: '列表', value: 'list', icon: 'menu' }, { label: '网格', value: 'grid', icon: 'folder' }]" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Segmented 分段控制器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
