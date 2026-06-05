<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="层级数据展示" id="tree" doc="tree">

      <demo-block title="基础用法" code="&lt;w-tree :data=&quot;treeData&quot; /&gt;"><w-tree :data="treeData" /></demo-block>
      <demo-block title="默认展开" code="&lt;w-tree :data=&quot;treeData&quot; expand-all /&gt;"><w-tree :data="treeData" expand-all /></demo-block>
      <demo-block title="虚拟化树" code="&lt;w-virtualized-tree :data=&quot;treeData&quot; /&gt;"><w-virtualized-tree :data="treeData" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Tree 树形控件'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
