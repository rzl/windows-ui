<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="固定元素" id="affix" doc="affix">

      <demo-block title="基础用法" code="&lt;p&gt;滚动页面时，下方元素会固定在顶部&lt;/p&gt;&lt;w-affix :offset=&quot;0&quot;&gt;&lt;w-alert title=&quot;固钉提示&quot; description=&quot;我会固定在顶部&quot; /&gt;&lt;/w-affix&gt;"><p>滚动页面时，下方元素会固定在顶部</p><w-affix :offset="0"><w-alert title="固钉提示" description="我会固定在顶部" /></w-affix></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Affix 固钉'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
