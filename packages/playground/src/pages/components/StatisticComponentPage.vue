<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('数值展示')" id="statistic" doc="statistic">

      <demo-block :title="t('基础用法')" :code="StatisticCode1">
        <w-space>
          <w-statistic title="用户总数" :value="12345" suffix="人" />
          <w-statistic title="增长率" :value="12.5" suffix="%" :precision="1" />
        </w-space>
      </demo-block>
      <demo-block :title="t('自定义样式')" :code="StatisticCode2"><w-statistic title="销售额" :value="888888" prefix="¥" :value-style="{ color: '#d92b2b' }" /></demo-block>

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

const title = t('Statistic 统计组件')

const StatisticCode1 = `<w-space>
  <w-statistic title="用户总数" :value="12345" suffix="人" />
  <w-statistic title="增长率" :value="12.5" suffix="%" :precision="1" />
</w-space>`
const StatisticCode2 = `<w-statistic title="销售额" :value="888888" prefix="¥" :value-style="{ color: '#d92b2b' }" />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
