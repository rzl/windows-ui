<template>
  <div class="demo-page">
    <h1 class="page-title">📎 Others 其他</h1>

    <!-- Divider -->
    <demo-section title="Divider 分割线" description="内容分隔，支持水平和垂直">
      <demo-block title="基础分割线"><p>上方内容</p><w-divider /><p>下方内容</p></demo-block>
      <demo-block title="带文字"><p>章节开始</p><w-divider>第一章</w-divider><p>章节内容...</p><w-divider>第二章</w-divider><p>更多内容...</p></demo-block>
      <demo-block title="垂直分割"><w-space><span>文本</span><w-divider direction="vertical" /><a href="#">链接</a><w-divider direction="vertical" /><w-icon name="search" /><w-divider direction="vertical" /><span>文本</span></w-space></demo-block>
      <demo-block title="不同内容分隔"><w-card header="卡片A"><p>卡片A内容</p></w-card><w-divider /><w-card header="卡片B"><p>卡片B内容</p></w-card></demo-block>
    </demo-section>

    <!-- Watermark -->
    <demo-section title="Watermark 水印" description="页面内容水印，防止截图泄露">
      <demo-block title="基础水印"><w-watermark content="Windows UI"><div style="padding:40px;background:#fff"><p>这是一个带水印的内容区域</p><p>水印会覆盖整个区域</p><w-table :data="[{a:1,b:2},{a:3,b:4}]" :columns="[{prop:'a',label:'A'},{prop:'b',label:'B'}]" /></div></w-watermark></demo-block>
      <demo-block title="自定义样式"><w-watermark content="Confidential" :font-size="20" color="rgba(255,0,0,0.15)" :rotate="-45"><div style="padding:40px;background:#fff"><p>自定义水印样式</p><p>更大的字体、红色、-45度旋转</p></div></w-watermark></demo-block>
      <demo-block title="浅色水印"><w-watermark content="SAMPLE" :font-size="16" color="rgba(0,0,0,0.05)" :rotate="-30"><div style="padding:40px;background:#fff"><p>非常浅的水印，不影响阅读</p><p>适合内部文档预览场景</p></div></w-watermark></demo-block>
      <demo-block title="密集水印"><w-watermark content="DEMO" :font-size="12" color="rgba(100,100,100,0.1)" :rotate="-15"><div style="padding:40px;background:#fff"><p>小字体、密集排列的水印</p><p>适合重要文件的预览保护</p></div></w-watermark></demo-block>
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
