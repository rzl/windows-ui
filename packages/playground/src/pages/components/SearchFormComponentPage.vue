<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('带查询和重置的搜索表单')" id="search-form" doc="search-form">

      <demo-block :title="t('基础用法')" :code="SearchFormCode1">
        <w-search-form :model="searchModel" @search="onSearch" @reset="onReset">
          <w-form-item :label="t('用户名')"><w-input v-model="searchModel.name" /></w-form-item>
          <w-form-item :label="t('状态')"><w-select v-model="searchModel.status" :options="statusOptions" /></w-form-item>
        </w-search-form>
      </demo-block>

      <demo-block :title="t('可折叠')" :code="SearchFormCode2">
        <w-search-form :model="searchModel2" collapsible @search="onSearch" @reset="onReset">
          <w-form-item :label="t('用户名')"><w-input v-model="searchModel2.name" /></w-form-item>
          <w-form-item :label="t('邮箱')"><w-input v-model="searchModel2.email" /></w-form-item>
          <w-form-item :label="t('手机')"><w-input v-model="searchModel2.phone" /></w-form-item>
          <w-form-item :label="t('状态')"><w-select v-model="searchModel2.status" :options="statusOptions" /></w-form-item>
        </w-search-form>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive } from 'vue'
const { t } = useI18n()

const searchModel = reactive({ name: '', status: '' })
const searchModel2 = reactive({ name: '', email: '', phone: '', status: '' })

const statusOptions = [
  { label: t('全部'), value: '' },
  { label: t('启用'), value: '1' },
  { label: t('禁用'), value: '0' }
]

function onSearch(model: Record<string, any>) {
  alert(t('搜索: ') + JSON.stringify(model))
}

function onReset() {
  alert(t('已重置'))
}

const title = t('SearchForm 搜索表单')

const searchFormCommonCode = `import { reactive } from 'vue'

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

function onSearch(model) {
  alert(JSON.stringify(model))
}

function onReset() {
  alert('已重置')
}`

const SearchFormCode1 = `${searchFormCommonCode}\n\nconst searchModel = reactive({ name: '', status: '' })\n\n<w-search-form :model="searchModel" @search="onSearch" @reset="onReset">
  <w-form-item label="用户名"><w-input v-model="searchModel.name" /></w-form-item>
  <w-form-item label="状态"><w-select v-model="searchModel.status" :options="statusOptions" /></w-form-item>
</w-search-form>`
const SearchFormCode2 = `${searchFormCommonCode}\n\nconst searchModel2 = reactive({ name: '', email: '', phone: '', status: '' })\n\n<w-search-form :model="searchModel2" collapsible @search="onSearch" @reset="onReset">
  <w-form-item label="用户名"><w-input v-model="searchModel2.name" /></w-form-item>
  <w-form-item label="邮箱"><w-input v-model="searchModel2.email" /></w-form-item>
  <w-form-item label="手机"><w-input v-model="searchModel2.phone" /></w-form-item>
  <w-form-item label="状态"><w-select v-model="searchModel2.status" :options="statusOptions" /></w-form-item>
</w-search-form>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
