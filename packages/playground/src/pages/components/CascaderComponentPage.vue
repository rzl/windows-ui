<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="多级联动选择" id="cascader" doc="cascader">

      <demo-block title="基础用法" code="&lt;w-cascader v-model=&quot;form.cascader&quot; :options=&quot;cascaderOptions&quot; placeholder=&quot;选择地址&quot; /&gt;"><w-cascader v-model="form.cascader" :options="cascaderOptions" placeholder="选择地址" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Cascader 级联选择器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
