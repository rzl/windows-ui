<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('轮播图')" id="carousel" doc="carousel">

            <demo-block :title="t('基础用法')" code="&lt;w-carousel :items=&quot;[{ color: '#245edb' }, { color: '#3a9e3a' }, { color: '#e4a010' }]&quot;&gt;
        &lt;template #default=&quot;{ item }&quot;&gt;
          &lt;div :style=&quot;{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }&quot;&gt;
            &lt;span style=&quot;color:#fff;font-size:20px&quot;&gt;Slide&lt;/span&gt;
          &lt;/div&gt;
        &lt;/template&gt;
      &lt;/w-carousel&gt;">
              <w-carousel :items="[{ color: '#245edb' }, { color: '#3a9e3a' }, { color: '#e4a010' }]">
                <template #default="{ item }">
                  <div :style="{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                    <span style="color:#fff;font-size:20px">Slide</span>
                  </div>
                </template>
              </w-carousel>
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

const title = t('Carousel 走马灯')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
