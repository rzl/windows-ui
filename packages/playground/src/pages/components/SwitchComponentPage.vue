<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="布尔状态切换" id="switch" doc="switch">

      <demo-block title="基础用法" code="&lt;w-switch v-model=&quot;form.switch&quot; /&gt;"><w-switch v-model="form.switch" /></demo-block>
      <demo-block title="文字描述" code="&lt;w-switch v-model=&quot;form.switch&quot; active-text=&quot;开&quot; inactive-text=&quot;关&quot; /&gt;"><w-switch v-model="form.switch" active-text="开" inactive-text="关" /></demo-block>
      <demo-block title="禁用" code="&lt;w-switch v-model=&quot;form.switch&quot; disabled /&gt;"><w-switch v-model="form.switch" disabled /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Switch 开关'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
