<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="树形结构选择" id="tree-select" doc="tree-select">

      <demo-block title="基础用法" code="&lt;w-tree-select v-model=&quot;form.treeselect&quot; :data=&quot;treeData&quot; /&gt;"><w-tree-select v-model="form.treeselect" :data="treeData" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Tree Select 树形选择'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
