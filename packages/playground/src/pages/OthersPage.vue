<template>
  <div class="demo-page">
    <h1 class="page-title">📎 Others 其他</h1>

    <demo-section title="Divider 分割线" description="内容分隔">
      <demo-block title="基础用法">
        <p>上方内容</p>
        <w-divider />
        <p>下方内容</p>
      </demo-block>
      <demo-block title="带文字">
        <p>上方内容</p>
        <w-divider>分割线</w-divider>
        <p>下方内容</p>
      </demo-block>
      <demo-block title="垂直分割">
        <w-space>
          <span>文本</span>
          <w-divider direction="vertical" />
          <a href="#">链接</a>
          <w-divider direction="vertical" />
          <span>文本</span>
        </w-space>
      </demo-block>
    </demo-section>

    <demo-section title="Watermark 水印" description="页面水印">
      <demo-block title="基础用法">
        <w-watermark content="Windows UI">
          <div style="padding:40px;background:#fff">
            <p>这是一个带水印的内容区域</p>
            <p>水印会覆盖整个区域</p>
          </div>
        </w-watermark>
      </demo-block>
      <demo-block title="自定义样式">
        <w-watermark content="Confidential" :font-size="20" color="rgba(255,0,0,0.15)" :rotate="-45">
          <div style="padding:40px;background:#fff">
            <p>自定义水印样式</p>
          </div>
        </w-watermark>
      </demo-block>
    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../components/DemoSection.vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
