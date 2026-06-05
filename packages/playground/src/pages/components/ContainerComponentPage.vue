<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="内容容器" id="container" doc="container">

      <demo-block title="固定宽度容器" code="&lt;w-container&gt;&lt;p&gt;这是一个固定最大宽度 960px 的容器&lt;/p&gt;&lt;/w-container&gt;">
        <w-container><p>这是一个固定最大宽度 960px 的容器</p></w-container>
      </demo-block>
      <demo-block title="流式容器" code="&lt;w-container fluid&gt;&lt;p&gt;这是一个占满宽度的流式容器&lt;/p&gt;&lt;/w-container&gt;">
        <w-container fluid><p>这是一个占满宽度的流式容器</p></w-container>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const iconNames = ['info','warning','error','success','close','folder','file','search','user','star','arrowUp','arrowDown','arrowLeft','arrowRight','menu','home','loading']

const title = 'Container 布局容器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
