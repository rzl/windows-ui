<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="内容折叠展开" id="collapse" doc="collapse">

      <demo-block title="基础用法" code="&lt;w-collapse :items=&quot;[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]&quot; /&gt;"><w-collapse :items="[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]" /></demo-block>
      <demo-block title="手风琴模式" code="&lt;w-collapse :items=&quot;[{ title: 'A', content: '内容A' }, { title: 'B', content: '内容B' }]&quot; accordion /&gt;"><w-collapse :items="[{ title: 'A', content: '内容A' }, { title: 'B', content: '内容B' }]" accordion /></demo-block>
      <demo-block title="自定义标题与操作" code="&lt;w-collapse :items=&quot;[{ title: '标题A', content: '内容A' }, { title: '标题B', content: '内容B' }]&quot;&gt;&lt;template #header=&quot;{ item, index }&quot;&gt;&lt;w-icon name=&quot;folder&quot; size=&quot;small&quot; /&gt;&lt;span&gt;{{ index + 1 }}. {{ item.title }}&lt;/span&gt;&lt;/template&gt;&lt;template #action=&quot;{ index }&quot;&gt;&lt;w-icon name=&quot;delete&quot; size=&quot;small&quot; style=&quot;cursor:pointer&quot; @click=&quot;alert('删除 ' + index)&quot; /&gt;&lt;/template&gt;&lt;/w-collapse&gt;">
        <w-collapse :items="[{ title: '标题A', content: '内容A' }, { title: '标题B', content: '内容B' }]">
          <template #header="{ item, index }"><w-icon name="folder" size="small" /><span>{{ index + 1 }}. {{ item.title }}</span></template>
          <template #action="{ index }"><w-icon name="delete" size="small" style="cursor:pointer" @click="alert('删除 ' + index)" /></template>
        </w-collapse>
      </demo-block>

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

const alert = (msg: string) => window.alert(msg)

const title = 'Collapse 折叠面板'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
