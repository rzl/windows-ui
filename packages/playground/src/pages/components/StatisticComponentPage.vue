<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="数值展示" id="statistic" doc="statistic">

      <demo-block title="基础用法" code="&lt;w-space&gt;&lt;w-statistic title=&quot;用户总数&quot; :value=&quot;12345&quot; suffix=&quot;人&quot; /&gt;&lt;w-statistic title=&quot;增长率&quot; :value=&quot;12.5&quot; suffix=&quot;%&quot; :precision=&quot;1&quot; /&gt;&lt;/w-space&gt;"><w-space><w-statistic title="用户总数" :value="12345" suffix="人" /><w-statistic title="增长率" :value="12.5" suffix="%" :precision="1" /></w-space></demo-block>
      <demo-block title="自定义样式" code="&lt;w-statistic title=&quot;销售额&quot; :value=&quot;888888&quot; prefix=&quot;¥&quot; :value-style=&quot;{ color: '#d92b2b' }&quot; /&gt;"><w-statistic title="销售额" :value="888888" prefix="¥" :value-style="{ color: '#d92b2b' }" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Statistic 统计组件'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
