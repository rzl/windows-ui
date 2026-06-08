<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="标记与分类" id="tag" doc="tag">

      <demo-block title="基础用法" code="&lt;w-space&gt;&lt;w-tag&gt;默认&lt;/w-tag&gt;&lt;w-tag type=&quot;primary&quot;&gt;主要&lt;/w-tag&gt;&lt;w-tag type=&quot;success&quot;&gt;成功&lt;/w-tag&gt;&lt;w-tag type=&quot;warning&quot;&gt;警告&lt;/w-tag&gt;&lt;w-tag type=&quot;danger&quot;&gt;危险&lt;/w-tag&gt;&lt;w-tag type=&quot;info&quot;&gt;信息&lt;/w-tag&gt;&lt;/w-space&gt;">
        <w-space><w-tag>默认</w-tag><w-tag type="primary">主要</w-tag><w-tag type="success">成功</w-tag><w-tag type="warning">警告</w-tag><w-tag type="danger">危险</w-tag><w-tag type="info">信息</w-tag></w-space>
      </demo-block>
      <demo-block title="可关闭" code="&lt;w-tag closable @close=&quot;alert('关闭')&quot;&gt;可关闭&lt;/w-tag&gt;"><w-tag closable @close="alert('关闭')">可关闭</w-tag></demo-block>
      <demo-block title="尺寸" code="&lt;w-space&gt;&lt;w-tag size=&quot;small&quot;&gt;小&lt;/w-tag&gt;&lt;w-tag&gt;中&lt;/w-tag&gt;&lt;w-tag size=&quot;large&quot;&gt;大&lt;/w-tag&gt;&lt;/w-space&gt;"><w-space><w-tag size="small">小</w-tag><w-tag>中</w-tag><w-tag size="large">大</w-tag></w-space></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'

const alert = (msg: string) => window.alert(msg)
const form = reactive({ date: '', page: 1, segment: 'day' })
const showTour = ref(false)

const calendarEvents = [{ date: new Date().toISOString().slice(0, 10), title: '今日事件' }]
const tableData = [{ name: '张三', age: 28, address: '北京' }, { name: '李四', age: 32, address: '上海' }, { name: '王五', age: 24, address: '广州' }]
const tableColumns = [{ prop: 'name', label: '姓名' }, { prop: 'age', label: '年龄' }, { prop: 'address', label: '地址' }]
const treeData = [{ label: '节点1', value: '1', children: [{ label: '子节点1-1', value: '1-1' }] }, { label: '节点2', value: '2' }]

const title = 'Tag 标签'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
