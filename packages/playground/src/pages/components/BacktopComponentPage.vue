<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="滚动返回顶部" id="backtop" doc="backtop">

      <demo-block title="用法说明" code="&lt;p&gt;页面滚动超过 200px 后，右下角显示回到顶部按钮&lt;/p&gt;&lt;w-backtop /&gt;"><p>页面滚动超过 200px 后，右下角显示回到顶部按钮</p><w-backtop /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Backtop 回到顶部'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
