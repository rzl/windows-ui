<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="用户头像展示" id="avatar" doc="avatar">

      <demo-block title="基础用法" code="&lt;w-space&gt;&lt;w-avatar alt=&quot;User&quot; /&gt;&lt;w-avatar icon=&quot;user&quot; /&gt;&lt;w-avatar src=&quot;https://via.placeholder.com/40/245edb/fff?text=U&quot; alt=&quot;Image&quot; /&gt;&lt;/w-space&gt;">
        <w-space><w-avatar alt="User" /><w-avatar icon="user" /><w-avatar src="https://via.placeholder.com/40/245edb/fff?text=U" alt="Image" /></w-space>
      </demo-block>
      <demo-block title="尺寸" code="&lt;w-space&gt;&lt;w-avatar size=&quot;small&quot; alt=&quot;SM&quot; /&gt;&lt;w-avatar alt=&quot;MD&quot; /&gt;&lt;w-avatar size=&quot;large&quot; alt=&quot;LG&quot; /&gt;&lt;/w-space&gt;"><w-space><w-avatar size="small" alt="SM" /><w-avatar alt="MD" /><w-avatar size="large" alt="LG" /></w-space></demo-block>
      <demo-block title="形状" code="&lt;w-space&gt;&lt;w-avatar shape=&quot;circle&quot; alt=&quot;圆&quot; /&gt;&lt;w-avatar shape=&quot;square&quot; alt=&quot;方&quot; /&gt;&lt;/w-space&gt;"><w-space><w-avatar shape="circle" alt="圆" /><w-avatar shape="square" alt="方" /></w-space></demo-block>
      <demo-block title="自定义颜色" code="&lt;w-avatar alt=&quot;AB&quot; bg-color=&quot;#e4a010&quot; color=&quot;#fff&quot; /&gt;"><w-avatar alt="AB" bg-color="#e4a010" color="#fff" /></demo-block>

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

const title = 'Avatar 头像'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
