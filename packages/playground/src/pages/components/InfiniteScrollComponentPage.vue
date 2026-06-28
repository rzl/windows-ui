<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('滚动加载更多')" id="infinite-scroll" doc="infinite-scroll">

            <demo-block :title="t('基础用法')" :code="InfiniteScrollCode1">
              <w-infinite-scroll :loading="false" :no-more="true">
                <div v-for="i in 5" :key="i" style="padding:8px;border-bottom:1px solid #e0e0e0">项目 {{ i }}</div>
              </w-infinite-scroll>
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

const title = t('Infinite Scroll 无限滚动')

const InfiniteScrollCode1 = `<w-infinite-scroll :loading="false" :no-more="true">
  <div v-for="i in 5" :key="i" style="padding:8px;border-bottom:1px solid #e0e0e0">项目 {{ i }}</div>
</w-infinite-scroll>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
