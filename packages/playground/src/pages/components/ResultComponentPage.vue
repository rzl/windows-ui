<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="操作结果反馈" id="result" doc="result">

      <demo-block title="成功" code="&lt;w-result icon=&quot;success&quot; title=&quot;操作成功&quot; subtitle=&quot;您的操作已成功完成&quot;&gt;&lt;template #extra&gt;&lt;w-button type=&quot;primary&quot;&gt;返回&lt;/w-button&gt;&lt;/template&gt;&lt;/w-result&gt;"><w-result icon="success" title="操作成功" subtitle="您的操作已成功完成"><template #extra><w-button type="primary">返回</w-button></template></w-result></demo-block>
      <demo-block title="警告" code="&lt;w-result icon=&quot;warning&quot; title=&quot;操作警告&quot; subtitle=&quot;请注意潜在风险&quot; /&gt;"><w-result icon="warning" title="操作警告" subtitle="请注意潜在风险" /></demo-block>
      <demo-block title="错误" code="&lt;w-result icon=&quot;error&quot; title=&quot;操作失败&quot; subtitle=&quot;请稍后重试&quot; /&gt;"><w-result icon="error" title="操作失败" subtitle="请稍后重试" /></demo-block>

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

const title = 'Result 结果'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
