<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="文件上传" id="upload" doc="upload">

      <demo-block title="单文件" code="&lt;w-upload /&gt;"><w-upload /></demo-block>
      <demo-block title="多文件" code="&lt;w-upload multiple /&gt;"><w-upload multiple /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Upload 上传器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
