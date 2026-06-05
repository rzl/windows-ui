<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="输入生成标签" id="input-tag" doc="input-tag">

      <demo-block title="基础用法" code="&lt;w-input-tag v-model=&quot;form.tags&quot; placeholder=&quot;输入后按回车&quot; /&gt;"><w-input-tag v-model="form.tags" placeholder="输入后按回车" /></demo-block>
      <demo-block title="最大数量" code="&lt;w-input-tag v-model=&quot;form.tags&quot; :max=&quot;3&quot; placeholder=&quot;最多3个标签&quot; /&gt;"><w-input-tag v-model="form.tags" :max="3" placeholder="最多3个标签" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Input Tag 标签输入框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
