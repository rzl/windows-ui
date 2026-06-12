<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('加载占位')" id="skeleton" doc="skeleton">

      <demo-block :title="t('基础用法')" code="&lt;w-skeleton :rows=&quot;3&quot; /&gt;"><w-skeleton :rows="3" /></demo-block>
      <demo-block :title="t('非加载状态')" code="&lt;w-skeleton :loading=&quot;false&quot;&gt;&lt;w-card header=&quot;内容已加载&quot;&gt;&lt;p&gt;真实内容区域&lt;/p&gt;&lt;/w-card&gt;&lt;/w-skeleton&gt;"><w-skeleton :loading="false"><w-card :header="t('内容已加载')"><p>真实内容区域</p></w-card></w-skeleton></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'
const { t } = useI18n()

const form = reactive({ date: '', page: 1, segment: 'day' })
const showTour = ref(false)

const calendarEvents = [{ date: new Date().toISOString().slice(0, 10), title: t('今日事件') }]
const tableData = [{ name: t('张三'), age: 28, address: t('北京') }, { name: t('李四'), age: 32, address: t('上海') }, { name: t('王五'), age: 24, address: t('广州') }]
const tableColumns = [{ prop: 'name', label: t('姓名') }, { prop: 'age', label: t('年龄') }, { prop: 'address', label: t('地址') }]
const treeData = [{ label: t('节点1'), value: '1', children: [{ label: t('子节点1-1'), value: '1-1' }] }, { label: t('节点2'), value: '2' }]

const title = t('Skeleton 骨架屏')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
