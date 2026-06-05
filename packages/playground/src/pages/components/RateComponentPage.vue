<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="星级评分" id="rate" doc="rate">

      <demo-block title="基础用法" code="&lt;w-rate v-model=&quot;form.rate&quot; /&gt;"><w-rate v-model="form.rate" /></demo-block>
      <demo-block title="显示分数" code="&lt;w-rate v-model=&quot;form.rate&quot; show-score /&gt;"><w-rate v-model="form.rate" show-score /></demo-block>
      <demo-block title="禁用" code="&lt;w-rate v-model=&quot;form.rate&quot; disabled /&gt;"><w-rate v-model="form.rate" disabled /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Rate 评分'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
