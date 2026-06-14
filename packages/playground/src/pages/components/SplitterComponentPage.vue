<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('可拖拽分隔的面板')" id="splitter" doc="splitter">

      <demo-block :title="t('左右分隔')" :code="SplitterCode1">
        <w-splitter :split="40" style="height:120px">
          <template #first><div style="padding:8px">左侧面板 (40%)</div></template>
          <template #second><div style="padding:8px">右侧面板 (60%)</div></template>
        </w-splitter>
      </demo-block>

      <demo-block :title="t('上下分隔')" :code="SplitterCode2">
        <w-splitter direction="vertical" :split="30" style="height:180px">
          <template #first><div style="padding:8px">上面板 (30%)</div></template>
          <template #second><div style="padding:8px">下面板 (70%)</div></template>
        </w-splitter>
      </demo-block>

      <demo-block :title="t('上下左右组合分隔')" :code="SplitterCode3">
        <w-splitter direction="vertical" :split="50" style="height:240px">
          <template #first>
            <w-splitter :split="50" style="height:100%">
              <template #first><div style="padding:8px">左上</div></template>
              <template #second><div style="padding:8px">右上</div></template>
            </w-splitter>
          </template>
          <template #second>
            <w-splitter :split="50" style="height:100%">
              <template #first><div style="padding:8px">左下</div></template>
              <template #second><div style="padding:8px">右下</div></template>
            </w-splitter>
          </template>
        </w-splitter>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const title = t('Splitter 分隔面板')

const SplitterCode1 = `<w-splitter :split="40" style="height:120px">
  <template #first><div style="padding:8px">左侧面板 (40%)</div></template>
  <template #second><div style="padding:8px">右侧面板 (60%)</div></template>
</w-splitter>`
const SplitterCode2 = `<w-splitter direction="vertical" :split="30" style="height:180px">
  <template #first><div style="padding:8px">上面板 (30%)</div></template>
  <template #second><div style="padding:8px">下面板 (70%)</div></template>
</w-splitter>`
const SplitterCode3 = `<w-splitter direction="vertical" :split="50" style="height:240px">
  <template #first>
    <w-splitter :split="50" style="height:100%">
      <template #first><div style="padding:8px">左上</div></template>
      <template #second><div style="padding:8px">右上</div></template>
    </w-splitter>
  </template>
  <template #second>
    <w-splitter :split="50" style="height:100%">
      <template #first><div style="padding:8px">左下</div></template>
      <template #second><div style="padding:8px">右下</div></template>
    </w-splitter>
  </template>
</w-splitter>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
