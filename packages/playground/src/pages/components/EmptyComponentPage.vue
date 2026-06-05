<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="无数据展示" id="empty" doc="empty">

      <demo-block title="基础用法" code="&lt;w-empty /&gt;"><w-empty /></demo-block>
      <demo-block title="自定义描述" code="&lt;w-empty description=&quot;暂无搜索结果&quot; /&gt;"><w-empty description="暂无搜索结果" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Empty 空状态'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
