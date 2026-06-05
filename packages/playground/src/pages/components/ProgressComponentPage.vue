<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="进度指示" id="progress" doc="progress">

            <demo-block title="基础用法" code="&lt;w-progress :percentage=&quot;30&quot; /&gt;"><w-progress :percentage="30" /></demo-block>
            <demo-block title="不同状态" code="&lt;w-space direction=&quot;vertical&quot;&gt;
        &lt;w-progress :percentage=&quot;100&quot; status=&quot;success&quot; /&gt;
        &lt;w-progress :percentage=&quot;80&quot; status=&quot;warning&quot; /&gt;
        &lt;w-progress :percentage=&quot;60&quot; status=&quot;danger&quot; /&gt;
      &lt;/w-space&gt;">
              <w-space direction="vertical">
                <w-progress :percentage="100" status="success" />
                <w-progress :percentage="80" status="warning" />
                <w-progress :percentage="60" status="danger" />
              </w-space>
            </demo-block>
            <demo-block title="不显示文字" code="&lt;w-progress :percentage=&quot;50&quot; :show-text=&quot;false&quot; /&gt;"><w-progress :percentage="50" :show-text="false" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Progress 进度条'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
