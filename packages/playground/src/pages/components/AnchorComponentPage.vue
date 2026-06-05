<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="页面内跳转" id="anchor" doc="anchor">

      <demo-block title="基础用法" code="&lt;w-anchor :links=&quot;[{ href: '#section1', title: '章节1' }, { href: '#section2', title: '章节2', level: 2 }, { href: '#section3', title: '章节3' }]&quot; /&gt;">
        <w-anchor :links="[{ href: '#section1', title: '章节1' }, { href: '#section2', title: '章节2', level: 2 }, { href: '#section3', title: '章节3' }]" />
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Anchor 锚点'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
