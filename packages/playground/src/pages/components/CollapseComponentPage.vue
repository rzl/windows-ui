<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('内容折叠展开')" id="collapse" doc="collapse">

      <demo-block :title="t('基础用法')" :code="CollapseCode1"><w-collapse :items="[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]" /></demo-block>
      <demo-block :title="t('手风琴模式')" :code="CollapseCode2"><w-collapse :items="[{ title: 'A', content: '内容A' }, { title: 'B', content: '内容B' }]" accordion /></demo-block>
      <demo-block :title="t('自定义标题与操作')" :code="CollapseCode3">
        <w-collapse :items="[{ title: '标题A', content: '内容A' }, { title: '标题B', content: '内容B' }]">
          <template #header="{ item, index }"><w-icon name="folder" size="small" /><span>{{ index + 1 }}. {{ item.title }}</span></template>
          <template #action="{ index }"><w-icon name="delete" size="small" style="cursor:pointer" @click="alert('删除 ' + index)" /></template>
        </w-collapse>
      </demo-block>

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

const alert = (msg: string) => window.alert(msg)

const title = t('Collapse 折叠面板')

const CollapseCode1 = `<w-collapse :items="[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]" />`
const CollapseCode2 = `<w-collapse :items="[{ title: 'A', content: '内容A' }, { title: 'B', content: '内容B' }]" accordion />`
const CollapseCode3 = `<w-collapse :items="[{ title: '标题A', content: '内容A' }, { title: '标题B', content: '内容B' }]"><template #header="{ item, index }"><w-icon name="folder" size="small" /><span>{{ index + 1 }}. {{ item.title }}</span></template><template #action="{ index }"><w-icon name="delete" size="small" style="cursor:pointer" @click="alert('删除 ' + index)" /></template></w-collapse>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
