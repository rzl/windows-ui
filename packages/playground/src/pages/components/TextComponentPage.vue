<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('文本样式组件')" id="text" doc="text">

            <demo-block :title="t('文本尺寸')" :code="TextCode1">
              <w-space direction="vertical">
                <w-text size="large">大号文本</w-text>
                <w-text>默认文本</w-text>
                <w-text size="small">小号文本</w-text>
              </w-space>
            </demo-block>
            <demo-block :title="t('文本类型')" :code="TextCode2">
              <w-space direction="vertical">
                <w-text type="primary">主要文本</w-text>
                <w-text type="success">成功文本</w-text>
                <w-text type="warning">警告文本</w-text>
                <w-text type="danger">危险文本</w-text>
                <w-text type="info">信息文本</w-text>
              </w-space>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const iconNames = ['info','warning','error','success','close','folder','file','search','user','star','arrowUp','arrowDown','arrowLeft','arrowRight','menu','home','loading']

const title = t('Text 文本')

const TextCode1 = `<w-space direction="vertical">
        <w-text size="large">大号文本</w-text>
        <w-text>默认文本</w-text>
        <w-text size="small">小号文本</w-text>
      </w-space>`
const TextCode2 = `<w-space direction="vertical">
        <w-text type="primary">主要文本</w-text>
        <w-text type="success">成功文本</w-text>
        <w-text type="warning">警告文本</w-text>
        <w-text type="danger">危险文本</w-text>
        <w-text type="info">信息文本</w-text>
      </w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
