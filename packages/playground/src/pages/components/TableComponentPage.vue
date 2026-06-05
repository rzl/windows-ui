<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="数据表格" id="table" doc="table">

      <demo-block title="基础表格" code="&lt;w-table :data=&quot;tableData&quot; :columns=&quot;tableColumns&quot; /&gt;"><w-table :data="tableData" :columns="tableColumns" /></demo-block>
      <demo-block title="虚拟化表格" code="&lt;w-virtualized-table :data=&quot;tableData&quot; :columns=&quot;tableColumns&quot; /&gt;"><w-virtualized-table :data="tableData" :columns="tableColumns" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Table 表格'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
