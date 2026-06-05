<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="元素间距容器" id="space" doc="space">

            <demo-block title="水平间距" code="&lt;w-space&gt;
        &lt;w-tag&gt;标签1&lt;/w-tag&gt;
        &lt;w-tag&gt;标签2&lt;/w-tag&gt;
        &lt;w-tag&gt;标签3&lt;/w-tag&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-tag>标签1</w-tag>
                <w-tag>标签2</w-tag>
                <w-tag>标签3</w-tag>
              </w-space>
            </demo-block>
            <demo-block title="垂直间距" code="&lt;w-space direction=&quot;vertical&quot;&gt;
        &lt;w-tag&gt;标签1&lt;/w-tag&gt;
        &lt;w-tag&gt;标签2&lt;/w-tag&gt;
        &lt;w-tag&gt;标签3&lt;/w-tag&gt;
      &lt;/w-space&gt;">
              <w-space direction="vertical">
                <w-tag>标签1</w-tag>
                <w-tag>标签2</w-tag>
                <w-tag>标签3</w-tag>
              </w-space>
            </demo-block>
            <demo-block title="自定义间距" code="&lt;w-space :size=&quot;24&quot;&gt;
        &lt;w-button&gt;按钮1&lt;/w-button&gt;
        &lt;w-button&gt;按钮2&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space :size="24">
                <w-button>按钮1</w-button>
                <w-button>按钮2</w-button>
              </w-space>
            </demo-block>
            <demo-block title="自动换行" code="&lt;w-space wrap&gt;
        &lt;w-tag v-for=&quot;i in 10&quot; :key=&quot;i&quot;&gt;标签{{ i }}&lt;/w-tag&gt;
      &lt;/w-space&gt;">
              <w-space wrap>
                <w-tag v-for="i in 10" :key="i">标签{{ i }}</w-tag>
              </w-space>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Space 间距'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
