<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="带查询和重置的搜索表单" id="search-form" doc="search-form">

      <demo-block title="基础用法" code="&lt;w-search-form :model=&quot;searchModel&quot; @search=&quot;onSearch&quot; @reset=&quot;onReset&quot;&gt;
  &lt;w-form-item label=&quot;用户名&quot;&gt;&lt;w-input v-model=&quot;searchModel.name&quot; /&gt;&lt;/w-form-item&gt;
  &lt;w-form-item label=&quot;状态&quot;&gt;&lt;w-select v-model=&quot;searchModel.status&quot; :options=&quot;statusOptions&quot; /&gt;&lt;/w-form-item&gt;
&lt;/w-search-form&gt;">
        <w-search-form :model="searchModel" @search="onSearch" @reset="onReset">
          <w-form-item label="用户名"><w-input v-model="searchModel.name" /></w-form-item>
          <w-form-item label="状态"><w-select v-model="searchModel.status" :options="statusOptions" /></w-form-item>
        </w-search-form>
      </demo-block>

      <demo-block title="可折叠" code="&lt;w-search-form :model=&quot;searchModel2&quot; collapsible @search=&quot;onSearch&quot; @reset=&quot;onReset&quot;&gt;
  &lt;w-form-item label=&quot;用户名&quot;&gt;&lt;w-input v-model=&quot;searchModel2.name&quot; /&gt;&lt;/w-form-item&gt;
  &lt;w-form-item label=&quot;邮箱&quot;&gt;&lt;w-input v-model=&quot;searchModel2.email&quot; /&gt;&lt;/w-form-item&gt;
  &lt;w-form-item label=&quot;手机&quot;&gt;&lt;w-input v-model=&quot;searchModel2.phone&quot; /&gt;&lt;/w-form-item&gt;
  &lt;w-form-item label=&quot;状态&quot;&gt;&lt;w-select v-model=&quot;searchModel2.status&quot; :options=&quot;statusOptions&quot; /&gt;&lt;/w-form-item&gt;
&lt;/w-search-form&gt;">
        <w-search-form :model="searchModel2" collapsible @search="onSearch" @reset="onReset">
          <w-form-item label="用户名"><w-input v-model="searchModel2.name" /></w-form-item>
          <w-form-item label="邮箱"><w-input v-model="searchModel2.email" /></w-form-item>
          <w-form-item label="手机"><w-input v-model="searchModel2.phone" /></w-form-item>
          <w-form-item label="状态"><w-select v-model="searchModel2.status" :options="statusOptions" /></w-form-item>
        </w-search-form>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive } from 'vue'

const searchModel = reactive({ name: '', status: '' })
const searchModel2 = reactive({ name: '', email: '', phone: '', status: '' })

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

function onSearch(model: Record<string, any>) {
  alert('搜索: ' + JSON.stringify(model))
}

function onReset() {
  alert('已重置')
}

const title = 'SearchForm 搜索表单'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
