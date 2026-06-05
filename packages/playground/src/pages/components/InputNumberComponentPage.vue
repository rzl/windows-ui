<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="数字输入与步进控制" id="input-number" doc="input-number">

      <demo-block title="基础用法" code="&lt;w-input-number v-model=&quot;form.number&quot; :min=&quot;0&quot; :max=&quot;100&quot; /&gt;"><w-input-number v-model="form.number" :min="0" :max="100" /></demo-block>
      <demo-block title="步进" code="&lt;w-input-number v-model=&quot;form.number&quot; :step=&quot;5&quot; /&gt;"><w-input-number v-model="form.number" :step="5" /></demo-block>
      <demo-block title="禁用" code="&lt;w-input-number v-model=&quot;form.number&quot; disabled /&gt;"><w-input-number v-model="form.number" disabled /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Input Number 数字输入框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
