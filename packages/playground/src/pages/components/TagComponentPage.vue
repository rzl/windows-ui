<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('标记与分类')" id="tag" doc="tag">

      <demo-block :title="t('基础用法')" :code="TagCode1">
        <w-space><w-tag>默认</w-tag><w-tag type="primary">主要</w-tag><w-tag type="success">成功</w-tag><w-tag type="warning">警告</w-tag><w-tag type="danger">危险</w-tag><w-tag type="info">信息</w-tag></w-space>
      </demo-block>
      <demo-block :title="t('可关闭')" :code="TagCode2"><w-tag closable @close="alert('关闭')">可关闭</w-tag></demo-block>
      <demo-block :title="t('尺寸')" :code="TagCode3"><w-space><w-tag size="small">小</w-tag><w-tag>中</w-tag><w-tag size="large">大</w-tag></w-space></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'
const { t } = useI18n()

const alert = (msg: string) => window.alert(msg)
const form = reactive({ date: '', page: 1, segment: 'day' })
const showTour = ref(false)

const calendarEvents = [{ date: new Date().toISOString().slice(0, 10), title: t('今日事件') }]
const tableData = [{ name: t('张三'), age: 28, address: t('北京') }, { name: t('李四'), age: 32, address: t('上海') }, { name: t('王五'), age: 24, address: t('广州') }]
const tableColumns = [{ prop: 'name', label: t('姓名') }, { prop: 'age', label: t('年龄') }, { prop: 'address', label: t('地址') }]
const treeData = [{ label: t('节点1'), value: '1', children: [{ label: t('子节点1-1'), value: '1-1' }] }, { label: t('节点2'), value: '2' }]

const title = t('Tag 标签')

const TagCode1 = `<w-space><w-tag>默认</w-tag><w-tag type="primary">主要</w-tag><w-tag type="success">成功</w-tag><w-tag type="warning">警告</w-tag><w-tag type="danger">危险</w-tag><w-tag type="info">信息</w-tag></w-space>`
const TagCode2 = `<w-tag closable @close="alert('关闭')">可关闭</w-tag>`
const TagCode3 = `<w-space><w-tag size="small">小</w-tag><w-tag>中</w-tag><w-tag size="large">大</w-tag></w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
