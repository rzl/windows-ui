<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('页面内容水印，防止截图泄露')" id="watermark" doc="watermark">

      <demo-block :title="t('基础水印')" :code="WatermarkCode1">
        <w-watermark content="Windows UI">
          <div style="padding:40px;background:#fff">
            <p>这是一个带水印的内容区域</p>
            <p>水印会覆盖整个区域</p>
            <w-table :data="[{a:1,b:2},{a:3,b:4}]" :columns="[{prop:'a',label:'A'},{prop:'b',label:'B'}]" />
          </div>
        </w-watermark>
      </demo-block>
      <demo-block :title="t('自定义样式')" :code="WatermarkCode2">
        <w-watermark content="Confidential" :font-size="20" color="rgba(255,0,0,0.15)" :rotate="-45">
          <div style="padding:40px;background:#fff">
            <p>自定义水印样式</p>
            <p>更大的字体、红色、-45度旋转</p>
          </div>
        </w-watermark>
      </demo-block>
      <demo-block :title="t('浅色水印')" :code="WatermarkCode3">
        <w-watermark content="SAMPLE" :font-size="16" color="rgba(0,0,0,0.05)" :rotate="-30">
          <div style="padding:40px;background:#fff">
            <p>非常浅的水印，不影响阅读</p>
            <p>适合内部文档预览场景</p>
          </div>
        </w-watermark>
      </demo-block>
      <demo-block :title="t('密集水印')" :code="WatermarkCode4">
        <w-watermark content="DEMO" :font-size="12" color="rgba(100,100,100,0.1)" :rotate="-15">
          <div style="padding:40px;background:#fff">
            <p>小字体、密集排列的水印</p>
            <p>适合重要文件的预览保护</p>
          </div>
        </w-watermark>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const title = t('Watermark 水印')

const WatermarkCode1 = `<w-watermark content="Windows UI">
  <div style="padding:40px;background:#fff">
    <p>这是一个带水印的内容区域</p>
    <p>水印会覆盖整个区域</p>
    <w-table :data="[{a:1,b:2},{a:3,b:4}]" :columns="[{prop:'a',label:'A'},{prop:'b',label:'B'}]" />
  </div>
</w-watermark>`
const WatermarkCode2 = `<w-watermark content="Confidential" :font-size="20" color="rgba(255,0,0,0.15)" :rotate="-45">
  <div style="padding:40px;background:#fff">
    <p>自定义水印样式</p>
    <p>更大的字体、红色、-45度旋转</p>
  </div>
</w-watermark>`
const WatermarkCode3 = `<w-watermark content="SAMPLE" :font-size="16" color="rgba(0,0,0,0.05)" :rotate="-30">
  <div style="padding:40px;background:#fff">
    <p>非常浅的水印，不影响阅读</p>
    <p>适合内部文档预览场景</p>
  </div>
</w-watermark>`
const WatermarkCode4 = `<w-watermark content="DEMO" :font-size="12" color="rgba(100,100,100,0.1)" :rotate="-15">
  <div style="padding:40px;background:#fff">
    <p>小字体、密集排列的水印</p>
    <p>适合重要文件的预览保护</p>
  </div>
</w-watermark>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
