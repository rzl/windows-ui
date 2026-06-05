<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="@提及功能" id="mention" doc="mention">

      <demo-block title="基础用法" code="&lt;w-mention v-model=&quot;form.mention&quot; :options=&quot;mentionOptions&quot; placeholder=&quot;输入 @ 触发&quot; /&gt;"><w-mention v-model="form.mention" :options="mentionOptions" placeholder="输入 @ 触发" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Mention 提及'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
