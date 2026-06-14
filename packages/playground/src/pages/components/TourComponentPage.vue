<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('新用户引导')" id="tour" doc="tour">

            <demo-block :title="t('基础用法')" :code="TourCode1">
              <w-button @click="showTour = true">{{ t('开始漫游') }}</w-button>
              <w-tour v-model:visible="showTour" :steps="[{ title: '欢迎', description: '欢迎使用 Windows UI' }, { title: '功能介绍', description: '这里展示各种组件' }]" />
            </demo-block>
            <demo-block :title="t('自定义标题与操作')" :code="TourCode2">
              <w-button @click="showTour2 = true">{{ t('自定义漫游') }}</w-button>
              <w-tour v-model:visible="showTour2" :steps="[{ title: '欢迎', description: '欢迎使用' }, { title: '完成', description: '设置完成' }]">
                <template #header="{ step, index }"><w-icon name="info" size="small" /><span style="margin-left:4px">第{{ index + 1 }}步：{{ step.title }}</span></template>
                <template #action="{ index }"><w-icon name="help" size="small" style="cursor:pointer" @click="alert('帮助 ' + index)" /></template>
              </w-tour>
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
const showTour2 = ref(false)

const alert = (msg: string) => window.alert(msg)

const calendarEvents = [{ date: new Date().toISOString().slice(0, 10), title: t('今日事件') }]
const tableData = [{ name: t('张三'), age: 28, address: t('北京') }, { name: t('李四'), age: 32, address: t('上海') }, { name: t('王五'), age: 24, address: t('广州') }]
const tableColumns = [{ prop: 'name', label: t('姓名') }, { prop: 'age', label: t('年龄') }, { prop: 'address', label: t('地址') }]
const treeData = [{ label: t('节点1'), value: '1', children: [{ label: t('子节点1-1'), value: '1-1' }] }, { label: t('节点2'), value: '2' }]

const title = t('Tour 漫游式引导')

const TourCode1 = `<w-button @click="showTour = true">开始漫游</w-button>
      <w-tour v-model:visible="showTour" :steps="[{ title: '欢迎', description: '欢迎使用 Windows UI' }, { title: '功能介绍', description: '这里展示各种组件' }]" />`
const TourCode2 = `<w-button @click="showTour2 = true">自定义漫游</w-button>
      <w-tour v-model:visible="showTour2" :steps="[{ title: '欢迎', description: '欢迎使用' }, { title: '完成', description: '设置完成' }]"><template #header="{ step, index }"><w-icon name="info" size="small" /><span style="margin-left:4px">第{{ index + 1 }}步：{{ step.title }}</span></template><template #action="{ index }"><w-icon name="help" size="small" style="cursor:pointer" @click="alert('帮助 ' + index)" /></template></w-tour>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
