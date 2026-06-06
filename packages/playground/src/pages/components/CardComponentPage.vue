<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="内容容器" id="card" doc="card">

      <demo-block title="基础卡片" code="&lt;w-card header=&quot;卡片标题&quot;&gt;&lt;p&gt;卡片内容区域&lt;/p&gt;&lt;/w-card&gt;"><w-card header="卡片标题"><p>卡片内容区域</p></w-card></demo-block>
      <demo-block title="悬停阴影" code="&lt;w-card header=&quot;悬停卡片&quot; hover&gt;&lt;p&gt;鼠标悬停查看效果&lt;/p&gt;&lt;/w-card&gt;"><w-card header="悬停卡片" hover><p>鼠标悬停查看效果</p></w-card></demo-block>
      <demo-block title="带底部" code="&lt;w-card header=&quot;标题&quot;&gt;&lt;p&gt;内容&lt;/p&gt;&lt;template #footer&gt;&lt;w-button size=&quot;small&quot;&gt;操作&lt;/w-button&gt;&lt;/template&gt;&lt;/w-card&gt;"><w-card header="标题"><p>内容</p><template #footer><w-button size="small">操作</w-button></template></w-card></demo-block>
      <demo-block title="头部自定义操作" code="&lt;w-card header=&quot;卡片标题&quot;&gt;&lt;p&gt;使用 action 插槽在标题右侧插入自定义操作。&lt;/p&gt;&lt;template #action&gt;&lt;w-icon name=&quot;more&quot; size=&quot;small&quot; style=&quot;cursor:pointer&quot; /&gt;&lt;/template&gt;&lt;/w-card&gt;"><w-card header="卡片标题"><p>使用 action 插槽在标题右侧插入自定义操作。</p><template #action><w-icon name="more" size="small" style="cursor:pointer" /></template></w-card></demo-block>

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

const title = 'Card 卡片'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
