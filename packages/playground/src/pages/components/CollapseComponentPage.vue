<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="内容折叠展开" id="collapse" doc="collapse">

      <demo-block title="基础用法" code="&lt;w-collapse :items=&quot;[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]&quot; /&gt;"><w-collapse :items="[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]" /></demo-block>
      <demo-block title="手风琴模式" code="&lt;w-collapse :items=&quot;[{ title: 'A', content: '内容A' }, { title: 'B', content: '内容B' }]&quot; accordion /&gt;"><w-collapse :items="[{ title: 'A', content: '内容A' }, { title: 'B', content: '内容B' }]" accordion /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Collapse 折叠面板'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
