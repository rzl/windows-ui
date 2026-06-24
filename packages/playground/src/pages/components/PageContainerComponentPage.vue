<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('页面内容容器，带标题和面包屑')" id="page-container" doc="page-container">

      <demo-block :title="t('基础用法')" :code="PageContainerCode1">
        <w-page-container title="用户管理" :breadcrumb="breadcrumb">
          <p>页面内容</p>
        </w-page-container>
      </demo-block>

      <demo-block :title="t('带操作区')" :code="PageContainerCode2">
        <w-page-container title="用户管理" :breadcrumb="breadcrumb">
          <template #extra>
            <w-button type="primary">{{ t('新增') }}</w-button>
            <w-button>{{ t('导出') }}</w-button>
          </template>
          <p>页面内容</p>
        </w-page-container>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const breadcrumb = [
  { label: t('首页'), path: '/' },
  { label: t('系统管理') },
  { label: t('用户管理') }
]

const title = t('PageContainer 页面容器')

const pageContainerBreadcrumbCode = `const breadcrumb = [
  { label: '首页', path: '/' },
  { label: '系统管理' },
  { label: '用户管理' }
]`

const PageContainerCode1 = `${pageContainerBreadcrumbCode}\n\n<w-page-container title="用户管理" :breadcrumb="breadcrumb">
  <p>页面内容</p>
</w-page-container>`
const PageContainerCode2 = `${pageContainerBreadcrumbCode}\n\n<w-page-container title="用户管理" :breadcrumb="breadcrumb">
  <template #extra>
    <w-button type="primary">新增</w-button>
    <w-button>导出</w-button>
  </template>
  <p>页面内容</p>
</w-page-container>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
