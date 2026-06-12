<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('键值对信息展示')" id="descriptions" doc="descriptions">

      <demo-block :title="t('基础用法')" code="&lt;w-descriptions title=&quot;用户信息&quot; :items=&quot;[{ label: '姓名', value: '张三' }, { label: '年龄', value: '28' }, { label: '地址', value: '北京市' }]&quot; /&gt;"><w-descriptions title="用户信息" :items="[{ label: '姓名', value: '张三' }, { label: '年龄', value: '28' }, { label: '地址', value: '北京市' }]" /></demo-block>
      <demo-block :title="t('多列')" code="&lt;w-descriptions title=&quot;订单信息&quot; :column=&quot;2&quot; :items=&quot;[{ label: '订单号', value: '2024001' }, { label: '金额', value: '¥199' }, { label: '状态', value: '已完成' }, { label: '时间', value: '2024-01-01' }]&quot; /&gt;"><w-descriptions title="订单信息" :column="2" :items="[{ label: '订单号', value: '2024001' }, { label: '金额', value: '¥199' }, { label: '状态', value: '已完成' }, { label: '时间', value: '2024-01-01' }]" /></demo-block>

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

const title = t('Descriptions 描述列表')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
