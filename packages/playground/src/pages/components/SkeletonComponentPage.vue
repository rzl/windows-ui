<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="加载占位" id="skeleton" doc="skeleton">

      <demo-block title="基础用法" code="&lt;w-skeleton :rows=&quot;3&quot; /&gt;"><w-skeleton :rows="3" /></demo-block>
      <demo-block title="非加载状态" code="&lt;w-skeleton :loading=&quot;false&quot;&gt;&lt;w-card header=&quot;内容已加载&quot;&gt;&lt;p&gt;真实内容区域&lt;/p&gt;&lt;/w-card&gt;&lt;/w-skeleton&gt;"><w-skeleton :loading="false"><w-card header="内容已加载"><p>真实内容区域</p></w-card></w-skeleton></demo-block>

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

const title = 'Skeleton 骨架屏'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
