<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="颜色拾取" id="color-picker" doc="color-picker">

      <demo-block title="基础用法" code="&lt;w-color-picker v-model=&quot;form.color&quot; /&gt;"><w-color-picker v-model="form.color" /></demo-block>
      <demo-block title="颜色面板" code="&lt;w-color-picker-panel @change=&quot;val =&gt; message('选择颜色: ' + val)&quot; /&gt;"><w-color-picker-panel @change="val => message('选择颜色: ' + val)" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Color Picker 颜色选择器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
