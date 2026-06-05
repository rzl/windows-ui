<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="时间轴展示" id="timeline" doc="timeline">

      <demo-block title="基础用法" code="&lt;w-timeline :items=&quot;[{ time: '2024-01', title: '开始' }, { time: '2024-02', title: '开发', content: '核心功能', color: '#245edb' }, { time: '2024-03', title: '上线' }]&quot; /&gt;"><w-timeline :items="[{ time: '2024-01', title: '开始' }, { time: '2024-02', title: '开发', content: '核心功能', color: '#245edb' }, { time: '2024-03', title: '上线' }]" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'

const form = reactive({ date: '', page: 1, segment: 'day' })
const showTour = ref(false)

const calendarEvents = [{ date: new Date().toISOString().slice(0, 10), title: '今日事件' }]
const tableData = [{ name: '张三', age: 28, address: '北京' }, { name: '李四', age: 32, address: '上海' }, { name: '王五', age: 24, address: '广州' }]
const tableColumns = [{ prop: 'name', label: '姓名' }, { prop: 'age', label: '年龄' }, { prop: 'address', label: '地址' }]
const treeData = [{ label: '节点1', value: '1', children: [{ label: '子节点1-1', value: '1-1' }] }, { label: '节点2', value: '2' }]

const title = 'Timeline 时间线'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
