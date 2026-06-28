<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('进度指示')" id="progress" doc="progress">

            <demo-block :title="t('基础用法')" :code="ProgressCode1"><w-progress :percentage="30" /></demo-block>
            <demo-block :title="t('不同状态')" :code="ProgressCode2">
              <w-space direction="vertical">
                <w-progress :percentage="100" status="success" />
                <w-progress :percentage="80" status="warning" />
                <w-progress :percentage="60" status="danger" />
              </w-space>
            </demo-block>
            <demo-block :title="t('不显示文字')" :code="ProgressCode3"><w-progress :percentage="50" :show-text="false" /></demo-block>

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

const title = t('Progress 进度条')

const ProgressCode1 = `<w-progress :percentage="30" />`
const ProgressCode2 = `<w-space direction="vertical">
  <w-progress :percentage="100" status="success" />
  <w-progress :percentage="80" status="warning" />
  <w-progress :percentage="60" status="danger" />
</w-space>`
const ProgressCode3 = `<w-progress :percentage="50" :show-text="false" />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
