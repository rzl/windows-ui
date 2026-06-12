<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('页面标题区')" id="page-header" doc="page-header">

      <demo-block :title="t('基础用法')" code="&lt;w-page-header title=&quot;页面标题&quot; @back=&quot;alert('返回')&quot; /&gt;"><w-page-header title="页面标题" @back="alert('返回')" /></demo-block>
      <demo-block :title="t('带操作')" code="&lt;w-page-header title=&quot;详情页&quot; show-back&gt;&lt;template #extra&gt;&lt;w-button size=&quot;small&quot;&gt;编辑&lt;/w-button&gt;&lt;w-button size=&quot;small&quot; type=&quot;primary&quot;&gt;保存&lt;/w-button&gt;&lt;/template&gt;&lt;/w-page-header&gt;"><w-page-header title="详情页" show-back><template #extra><w-button size="small">{{ t('编辑') }}</w-button><w-button size="small" type="primary">{{ t('保存') }}</w-button></template></w-page-header></demo-block>
      <demo-block :title="t('自定义标题与操作')" code="&lt;w-page-header show-back&gt;&lt;template #title&gt;&lt;w-icon name=&quot;home&quot; size=&quot;small&quot; /&gt;&lt;span style=&quot;margin-left:4px&quot;&gt;首页&lt;/span&gt;&lt;/template&gt;&lt;template #action&gt;&lt;w-button size=&quot;small&quot;&gt;刷新&lt;/w-button&gt;&lt;/template&gt;&lt;/w-page-header&gt;">
        <w-page-header show-back>
          <template #title><w-icon name="home" size="small" /><span style="margin-left:4px">首页</span></template>
          <template #action><w-button size="small">刷新</w-button></template>
        </w-page-header>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const alert = (msg: string) => window.alert(msg)

const title = t('Page Header 页头')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
