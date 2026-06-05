<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="页面标题区" id="page-header" doc="page-header">

      <demo-block title="基础用法" code="&lt;w-page-header title=&quot;页面标题&quot; @back=&quot;alert('返回')&quot; /&gt;"><w-page-header title="页面标题" @back="alert('返回')" /></demo-block>
      <demo-block title="带操作" code="&lt;w-page-header title=&quot;详情页&quot; show-back&gt;&lt;template #extra&gt;&lt;w-button size=&quot;small&quot;&gt;编辑&lt;/w-button&gt;&lt;w-button size=&quot;small&quot; type=&quot;primary&quot;&gt;保存&lt;/w-button&gt;&lt;/template&gt;&lt;/w-page-header&gt;"><w-page-header title="详情页" show-back><template #extra><w-button size="small">编辑</w-button><w-button size="small" type="primary">保存</w-button></template></w-page-header></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const alert = (msg: string) => window.alert(msg)

const title = 'Page Header 页头'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
