<template>
  <div class="list-page">
    <w-card header="首页配置">
      <div class="toolbar">
        <w-button type="primary" @click="handleSave">保存配置</w-button>
      </div>

      <w-form :model="config">
        <w-form-item label="配置名称">
          <w-input v-model="config.name" />
        </w-form-item>
      </w-form>

      <div class="widget-list">
        <div v-for="(widget, index) in config.widgets" :key="index" class="widget-item">
          <w-card>
            <div class="widget-header">
              <strong>组件 #{{ index + 1 }}</strong>
              <w-button type="danger" size="small" @click="removeWidget(index)">删除</w-button>
            </div>
            <w-form :model="widget">
              <w-form-item label="组件类型">
                <w-select v-model="widget.type" :options="widgetTypeOptions" />
              </w-form-item>
              <w-form-item label="标题">
                <w-input v-model="widget.title" />
              </w-form-item>
              <w-form-item v-if="widget.type === 'stat'" label="统计字段">
                <w-select v-model="widget.field" :options="statFieldOptions" />
              </w-form-item>
              <w-form-item v-if="widget.type === 'link'" label="链接路径">
                <w-input v-model="widget.path" />
              </w-form-item>
              <w-form-item v-if="widget.type === 'dashboard'" label="仪表盘编码">
                <w-input v-model="widget.dashboardCode" />
              </w-form-item>
              <w-form-item label="图标">
                <w-input v-model="widget.icon" />
              </w-form-item>
              <w-form-item label="颜色">
                <w-select v-model="widget.color" :options="colorOptions" />
              </w-form-item>
            </w-form>
          </w-card>
        </div>
      </div>

      <div class="toolbar" style="margin-top: 16px;">
        <w-button @click="addWidget">+ 添加组件</w-button>
      </div>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import * as dashboardApi from '@/api/dashboard'

const config = reactive<any>({
  code: 'default',
  name: '默认首页',
  widgets: []
})

const widgetTypeOptions = [
  { label: '统计卡片', value: 'stat' },
  { label: '快捷链接', value: 'link' },
  { label: '仪表盘', value: 'dashboard' },
  { label: '公告', value: 'notice' }
]

const statFieldOptions = [
  { label: '用户数量', value: 'userCount' },
  { label: '数据模型', value: 'modelCount' },
  { label: '消息数量', value: 'messageCount' }
]

const colorOptions = [
  { label: '主色', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

onMounted(() => loadData())

async function loadData() {
  const data = await dashboardApi.getHomepageConfig('default')
  Object.assign(config, data)
}

function addWidget() {
  config.widgets.push({
    type: 'stat',
    title: '新组件',
    field: 'userCount',
    icon: 'star',
    color: 'primary'
  })
}

function removeWidget(index: number) {
  config.widgets.splice(index, 1)
}

async function handleSave() {
  await dashboardApi.saveHomepageConfig({
    code: config.code,
    name: config.name,
    widgets: config.widgets,
    status: 1
  })
  alert('保存成功')
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.widget-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.widget-item { }
.widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
</style>
