<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="新用户引导" id="tour" doc="tour">

            <demo-block title="基础用法" code="&lt;w-button @click=&quot;showTour = true&quot;&gt;开始漫游&lt;/w-button&gt;
      &lt;w-tour v-model=&quot;showTour&quot; :steps=&quot;[{ title: '欢迎', description: '欢迎使用 Windows UI' }, { title: '功能介绍', description: '这里展示各种组件' }]&quot; /&gt;">
              <w-button @click="showTour = true">开始漫游</w-button>
              <w-tour v-model="showTour" :steps="[{ title: '欢迎', description: '欢迎使用 Windows UI' }, { title: '功能介绍', description: '这里展示各种组件' }]" />
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Tour 漫游式引导'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
