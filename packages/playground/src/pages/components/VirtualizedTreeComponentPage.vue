<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('虚拟化树形组件，支持大数据量')" id="virtualized-tree" doc="virtualized-tree">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <w-virtualized-tree :data="data" :props="defaultProps" :height="300" />
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const { t } = useI18n()
const title = 'VirtualizedTree 虚拟化树'

const defaultProps = { children: 'children', label: 'label' }
const data = Array.from({ length: 100 }, (_, i) => ({
  label: t('节点 ') + (i + 1),
  children: Array.from({ length: 10 }, (_, j) => ({
    label: t('子节点 ') + (i + 1) + '-' + (j + 1)
  }))
}))

const codeBasic = `<script setup>
const defaultProps = { children: 'children', label: 'label' }
const data = Array.from({ length: 100 }, (_, i) => ({
  label: '节点 ' + (i + 1),
  children: Array.from({ length: 10 }, (_, j) => ({
    label: '子节点 ' + (i + 1) + '-' + (j + 1)
  }))
}))
<\/script>

<template>
  <w-virtualized-tree :data="data" :props="defaultProps" :height="300" />
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
