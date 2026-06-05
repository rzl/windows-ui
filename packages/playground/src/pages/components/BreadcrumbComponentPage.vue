<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="路径导航" id="breadcrumb" doc="breadcrumb">

      <demo-block title="基础用法" code="&lt;w-breadcrumb :items=&quot;[{ label: '首页', href: '/' }, { label: '产品', href: '/product' }, { label: '详情' }]&quot; /&gt;"><w-breadcrumb :items="[{ label: '首页', href: '/' }, { label: '产品', href: '/product' }, { label: '详情' }]" /></demo-block>
      <demo-block title="自定义分隔符" code="&lt;w-breadcrumb :items=&quot;[{ label: 'A' }, { label: 'B' }, { label: 'C' }]&quot; separator=&quot;/&quot; /&gt;"><w-breadcrumb :items="[{ label: 'A' }, { label: 'B' }, { label: 'C' }]" separator="/" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Breadcrumb 面包屑'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
