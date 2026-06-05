<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="可拖拽分隔的面板" id="splitter" doc="splitter">

            <demo-block title="左右分隔" code="&lt;w-splitter :split=&quot;40&quot; style=&quot;height:120px&quot;&gt;
        &lt;template #left&gt;&lt;div style=&quot;padding:8px&quot;&gt;左侧面板 (40%)&lt;/div&gt;&lt;/template&gt;
        &lt;template #right&gt;&lt;div style=&quot;padding:8px&quot;&gt;右侧面板 (60%)&lt;/div&gt;&lt;/template&gt;
      &lt;/w-splitter&gt;">
              <w-splitter :split="40" style="height:120px">
                <template #left><div style="padding:8px">左侧面板 (40%)</div></template>
                <template #right><div style="padding:8px">右侧面板 (60%)</div></template>
              </w-splitter>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Splitter 分隔面板'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
