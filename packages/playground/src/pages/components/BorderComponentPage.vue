<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="XP 风格的边框样式" id="border" doc="border">

            <demo-block title="边框类型" code="&lt;w-space&gt;
        &lt;w-border type=&quot;raised&quot; style=&quot;padding:16px&quot;&gt;凸起边框 (Raised)&lt;/w-border&gt;
        &lt;w-border type=&quot;sunken&quot; style=&quot;padding:16px&quot;&gt;凹陷边框 (Sunken)&lt;/w-border&gt;
        &lt;w-border type=&quot;field&quot; style=&quot;padding:16px&quot;&gt;字段边框 (Field)&lt;/w-border&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-border type="raised" style="padding:16px">凸起边框 (Raised)</w-border>
                <w-border type="sunken" style="padding:16px">凹陷边框 (Sunken)</w-border>
                <w-border type="field" style="padding:16px">字段边框 (Field)</w-border>
              </w-space>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Border 边框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
