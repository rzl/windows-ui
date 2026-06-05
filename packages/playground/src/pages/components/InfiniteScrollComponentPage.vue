<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="滚动加载更多" id="infinite-scroll" doc="infinite-scroll">

            <demo-block title="基础用法" code="&lt;w-infinite-scroll :loading=&quot;false&quot; :no-more=&quot;true&quot;&gt;
        &lt;div v-for=&quot;i in 5&quot; :key=&quot;i&quot; style=&quot;padding:8px;border-bottom:1px solid #e0e0e0&quot;&gt;项目 {{ i }}&lt;/div&gt;
      &lt;/w-infinite-scroll&gt;">
              <w-infinite-scroll :loading="false" :no-more="true">
                <div v-for="i in 5" :key="i" style="padding:8px;border-bottom:1px solid #e0e0e0">项目 {{ i }}</div>
              </w-infinite-scroll>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Infinite Scroll 无限滚动'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
