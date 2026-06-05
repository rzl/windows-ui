<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="流程步骤" id="steps" doc="steps">

      <demo-block title="基础用法" code="&lt;w-steps :items=&quot;[{ title: '步骤1', description: '描述1' }, { title: '步骤2', description: '描述2' }, { title: '步骤3' }]&quot; :active=&quot;1&quot; /&gt;"><w-steps :items="[{ title: '步骤1', description: '描述1' }, { title: '步骤2', description: '描述2' }, { title: '步骤3' }]" :active="1" /></demo-block>
      <demo-block title="已完成" code="&lt;w-steps :items=&quot;[{ title: '提交' }, { title: '审核' }, { title: '完成' }]&quot; :active=&quot;3&quot; /&gt;"><w-steps :items="[{ title: '提交' }, { title: '审核' }, { title: '完成' }]" :active="3" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Steps 步骤条'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
