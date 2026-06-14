<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('内容容器')" id="card" doc="card">

      <demo-block :title="t('基础卡片')" :code="CardCode1"><w-card :header="t('卡片标题')"><p>卡片内容区域</p></w-card></demo-block>
      <demo-block :title="t('悬停阴影')" :code="CardCode2"><w-card :header="t('悬停卡片')" hover><p>鼠标悬停查看效果</p></w-card></demo-block>
      <demo-block :title="t('带底部')" :code="CardCode3"><w-card :header="t('标题')"><p>内容</p><template #footer><w-button size="small">{{ t('操作') }}</w-button></template></w-card></demo-block>
      <demo-block :title="t('头部自定义操作')" :code="CardCode4"><w-card header="卡片标题"><p>使用 action 插槽在标题右侧插入自定义操作。</p><template #action><w-icon name="more" size="small" style="cursor:pointer" /></template></w-card></demo-block>

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

const title = t('Card 卡片')

const CardCode1 = `<w-card header="卡片标题"><p>卡片内容区域</p></w-card>`
const CardCode2 = `<w-card header="悬停卡片" hover><p>鼠标悬停查看效果</p></w-card>`
const CardCode3 = `<w-card header="标题"><p>内容</p><template #footer><w-button size="small">操作</w-button></template></w-card>`
const CardCode4 = `<w-card header="卡片标题"><p>使用 action 插槽在标题右侧插入自定义操作。</p><template #action><w-icon name="more" size="small" style="cursor:pointer" /></template></w-card>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
