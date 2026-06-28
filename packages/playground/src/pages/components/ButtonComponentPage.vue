<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('基础操作按钮，支持多种类型和尺寸')" id="button" doc="button">

            <demo-block :title="t('按钮类型')" :code="ButtonCode1">
              <w-space wrap>
                <w-button>{{ t('默认') }}</w-button>
                <w-button type="primary">{{ t('主要') }}</w-button>
                <w-button type="success">{{ t('成功') }}</w-button>
                <w-button type="warning">{{ t('警告') }}</w-button>
                <w-button type="danger">{{ t('危险') }}</w-button>
                <w-button type="info">{{ t('信息') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('朴素按钮')" :code="ButtonCode2">
              <w-space>
                <w-button plain>{{ t('朴素') }}</w-button>
                <w-button type="primary" plain>{{ t('主要朴素') }}</w-button>
                <w-button type="danger" plain>{{ t('危险朴素') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('圆角按钮')" :code="ButtonCode3">
              <w-space>
                <w-button round>{{ t('圆角') }}</w-button>
                <w-button type="primary" round>{{ t('主要圆角') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('按钮尺寸')" :code="ButtonCode4">
              <w-space>
                <w-button size="large">{{ t('大号') }}</w-button>
                <w-button>{{ t('默认') }}</w-button>
                <w-button size="small">{{ t('小号') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('禁用状态')" :code="ButtonCode5">
              <w-space>
                <w-button disabled>{{ t('禁用') }}</w-button>
                <w-button type="primary" disabled>{{ t('禁用主要') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('图标按钮')" :code="ButtonCode6">
              <w-space>
                <w-button icon="search">{{ t('搜索') }}</w-button>
                <w-button type="primary" icon="arrowRight">{{ t('下一步') }}</w-button>
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

const title = t('Button 按钮')

const ButtonCode1 = `<w-space wrap>
  <w-button>默认</w-button>
  <w-button type="primary">主要</w-button>
  <w-button type="success">成功</w-button>
  <w-button type="warning">警告</w-button>
  <w-button type="danger">危险</w-button>
  <w-button type="info">信息</w-button>
</w-space>`
const ButtonCode2 = `<w-space>
  <w-button plain>朴素</w-button>
  <w-button type="primary" plain>主要朴素</w-button>
  <w-button type="danger" plain>危险朴素</w-button>
</w-space>`
const ButtonCode3 = `<w-space>
  <w-button round>圆角</w-button>
  <w-button type="primary" round>主要圆角</w-button>
</w-space>`
const ButtonCode4 = `<w-space>
  <w-button size="large">大号</w-button>
  <w-button>默认</w-button>
  <w-button size="small">小号</w-button>
</w-space>`
const ButtonCode5 = `<w-space>
  <w-button disabled>禁用</w-button>
  <w-button type="primary" disabled>禁用主要</w-button>
</w-space>`
const ButtonCode6 = `<w-space>
  <w-button icon="search">搜索</w-button>
  <w-button type="primary" icon="arrowRight">下一步</w-button>
</w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
