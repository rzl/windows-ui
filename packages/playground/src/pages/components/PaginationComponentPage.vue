<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="分页导航" id="pagination" doc="pagination">

      <demo-block title="基础用法" code="&lt;w-pagination v-model:current-page=&quot;form.page&quot; :total=&quot;100&quot; /&gt;"><w-pagination v-model:current-page="form.page" :total="100" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Pagination 分页'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
