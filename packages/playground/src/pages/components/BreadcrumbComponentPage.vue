<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('路径导航')" id="breadcrumb" doc="breadcrumb">

      <demo-block :title="t('基础用法')" :code="BreadcrumbCode1"><w-breadcrumb :items="[{ label: '首页', href: '/' }, { label: '产品', href: '/product' }, { label: '详情' }]" /></demo-block>
      <demo-block :title="t('自定义分隔符')" :code="BreadcrumbCode2"><w-breadcrumb :items="[{ label: 'A' }, { label: 'B' }, { label: 'C' }]" separator="/" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const alert = (msg: string) => window.alert(msg)

const title = t('Breadcrumb 面包屑')

const BreadcrumbCode1 = `<w-breadcrumb :items="[{ label: '首页', href: '/' }, { label: '产品', href: '/product' }, { label: '详情' }]" />`
const BreadcrumbCode2 = `<w-breadcrumb :items="[{ label: 'A' }, { label: 'B' }, { label: 'C' }]" separator="/" />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
