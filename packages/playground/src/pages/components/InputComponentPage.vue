<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="基础文本输入" id="input" doc="input">

      <demo-block title="基础用法" code="&lt;w-input v-model=&quot;form.input&quot; placeholder=&quot;请输入内容&quot; /&gt;"><w-input v-model="form.input" placeholder="请输入内容" /></demo-block>
      <demo-block title="前缀/后缀图标" code="&lt;w-input v-model=&quot;form.input&quot; prefix-icon=&quot;search&quot; suffix-icon=&quot;close&quot; /&gt;"><w-input v-model="form.input" prefix-icon="search" suffix-icon="close" /></demo-block>
      <demo-block title="可清空" code="&lt;w-input v-model=&quot;form.input2&quot; clearable placeholder=&quot;输入后可清空&quot; /&gt;"><w-input v-model="form.input2" clearable placeholder="输入后可清空" /></demo-block>
      <demo-block title="禁用状态" code="&lt;w-input v-model=&quot;form.input&quot; disabled /&gt;"><w-input v-model="form.input" disabled /></demo-block>
      <demo-block title="尺寸" code="&lt;w-space&gt;&lt;w-input v-model=&quot;form.input&quot; size=&quot;small&quot; placeholder=&quot;small&quot; /&gt;&lt;w-input v-model=&quot;form.input&quot; placeholder=&quot;default&quot; /&gt;&lt;w-input v-model=&quot;form.input&quot; size=&quot;large&quot; placeholder=&quot;large&quot; /&gt;&lt;/w-space&gt;"><w-space><w-input v-model="form.input" size="small" placeholder="small" /><w-input v-model="form.input" placeholder="default" /><w-input v-model="form.input" size="large" placeholder="large" /></w-space></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Input 输入框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
