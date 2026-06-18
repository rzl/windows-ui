<template>
  <div class="designer-page">
    <w-card :header="`应用设计 - ${app.name || app.code || ''}`">
      <div class="toolbar">
        <w-button size="small" @click="goBack">返回</w-button>
        <w-space>
          <w-button size="small" @click="versionVisible = true">版本管理</w-button>
          <w-button size="small" @click="exportAppFile">导出应用</w-button>
          <w-button type="primary" size="small" @click="handleSave">保存</w-button>
        </w-space>
      </div>

      <w-form :inline="true">
        <w-form-item label="应用编码">
          <w-input v-model="app.code" disabled style="width: 160px" />
        </w-form-item>
        <w-form-item label="应用名称">
          <w-input v-model="app.name" style="width: 160px" />
        </w-form-item>
        <w-form-item label="分类">
          <w-input v-model="app.category" style="width: 120px" />
        </w-form-item>
        <w-form-item label="图标">
          <w-input v-model="app.icon" style="width: 120px" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="app.status" active-text="启用" inactive-text="禁用" />
        </w-form-item>
        <w-form-item label="上架市场">
          <w-switch v-model="app.isMarket" active-text="上架" inactive-text="下架" />
        </w-form-item>
      </w-form>

      <w-tabs v-model="activeTab" class="main-tabs">
        <w-tab-pane label="资源" name="resources">
          <div class="designer-body">
            <div class="resource-panel">
              <div class="panel-title">可添加资源</div>
              <w-tabs v-model="resourceTabIndex" :tabs="resourceTabOptions">
                <template #default>
                  <div v-if="resourceTabIndex === 0" class="resource-list">
                    <div v-for="m in models" :key="m.code" class="resource-item" @click="addItem('model', m.code, m.name)">
                      {{ m.name }}
                    </div>
                  </div>
                  <div v-else-if="resourceTabIndex === 1" class="resource-list">
                    <div v-for="r in reports" :key="r.code" class="resource-item" @click="addItem('report', r.code, r.name)">
                      {{ r.name }}
                    </div>
                  </div>
                  <div v-else-if="resourceTabIndex === 2" class="resource-list">
                    <div v-for="d in dashboards" :key="d.code" class="resource-item" @click="addItem('dashboard', d.code, d.name)">
                      {{ d.name }}
                    </div>
                  </div>
                  <div v-else-if="resourceTabIndex === 3" class="resource-list">
                    <div v-for="p in printTemplates" :key="p.code" class="resource-item" @click="addItem('print', p.code, p.name)">
                      {{ p.name }}
                    </div>
                  </div>
                  <div v-else-if="resourceTabIndex === 4" class="resource-list">
                    <div v-for="p in pages" :key="p.code" class="resource-item" @click="addItem('page', p.code, p.name)">
                      {{ p.name }}
                    </div>
                  </div>
                </template>
              </w-tabs>
            </div>

            <div class="selected-panel">
              <div class="panel-title">已选资源</div>
              <w-table :data="items" :columns="selectedColumns" stripe border>
                <template #type="{ row }">
                  {{ typeLabel(row.type) }}
                </template>
                <template #action="{ $index }">
                  <w-button size="small" type="danger" @click="removeItem($index)">删除</w-button>
                </template>
              </w-table>
            </div>
          </div>
        </w-tab-pane>

        <w-tab-pane label="门户配置" name="portal">
          <div class="portal-config-panel">
            <w-form :model="portalConfig" :inline="true">
              <w-form-item label="视图模式">
                <w-select v-model="portalConfig.mode" :options="modeOptions" style="width: 140px;" />
              </w-form-item>
              <w-form-item label="显示资源入口">
                <w-switch v-model="portalConfig.showResources" active-text="显示" inactive-text="隐藏" />
              </w-form-item>
            </w-form>

            <div class="widget-list">
              <div v-for="(widget, index) in portalConfig.widgets" :key="index" class="widget-item">
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
                    <template v-if="widget.type === 'stat'">
                      <w-form-item label="统计字段">
                        <w-input v-model="widget.field" placeholder="如 userCount" />
                      </w-form-item>
                      <w-form-item label="数据源类型">
                        <w-select v-model="widget.dataSource.type" :options="dataSourceTypeOptions" />
                      </w-form-item>
                      <w-form-item v-if="widget.dataSource.type === 'static'" label="静态值">
                        <w-input v-model="widget.dataSource.value" />
                      </w-form-item>
                      <w-form-item v-if="widget.dataSource.type === 'sql'" label="SQL">
                        <textarea v-model="widget.dataSource.sql" class="w-xp-textarea" rows="3" placeholder="仅支持 SELECT 查询" />
                      </w-form-item>
                      <w-form-item v-if="widget.dataSource.type === 'api'" label="接口地址">
                        <w-input v-model="widget.dataSource.api.url" placeholder="例如 /lowcode/users/count" />
                      </w-form-item>
                      <w-form-item v-if="widget.dataSource.type === 'script'" label="执行脚本">
                        <textarea v-model="widget.dataSource.script" class="w-xp-textarea" rows="4" />
                      </w-form-item>
                    </template>
                    <w-form-item v-if="widget.type === 'link'" label="链接路径">
                      <w-input v-model="widget.path" />
                    </w-form-item>
                    <w-form-item v-if="widget.type === 'dashboard'" label="仪表盘编码">
                      <w-input v-model="widget.dashboardCode" />
                    </w-form-item>
                    <w-form-item v-if="widget.type === 'notice'" label="公告内容">
                      <w-input v-model="widget.content" type="textarea" :rows="2" />
                    </w-form-item>
                    <w-form-item v-if="widget.type === 'pending-task'" label="显示条数">
                      <w-input-number v-model="widget.limit" :min="1" :max="20" />
                    </w-form-item>
                    <w-form-item v-if="widget.type === 'app-resources'" label="显示条数">
                      <w-input-number v-model="widget.limit" :min="1" :max="20" />
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
          </div>
        </w-tab-pane>
      </w-tabs>
    </w-card>

    <w-dialog v-model="versionVisible" title="版本管理" width="680">
      <div class="toolbar">
        <w-button type="primary" size="small" @click="openSnapshotDialog">创建快照</w-button>
      </div>
      <w-table :data="versions" :columns="versionColumns" stripe border>
        <template #is_published="{ row }">
          <w-tag :type="row.is_published ? 'success' : 'info'">{{ row.is_published ? '已发布' : '未发布' }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button size="small" @click="publish(row)">发布</w-button>
            <w-button size="small" @click="rollback(row)">回滚</w-button>
          </w-space>
        </template>
      </w-table>
      <template #footer>
        <w-button @click="versionVisible = false">关闭</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="snapshotVisible" title="创建快照" width="420">
      <w-form :model="snapshotForm">
        <w-form-item label="版本号">
          <w-input v-model="snapshotForm.version" placeholder="如 v1.0.0" />
        </w-form-item>
        <w-form-item label="描述">
          <w-input v-model="snapshotForm.description" type="textarea" :rows="2" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="snapshotVisible = false">取消</w-button>
        <w-button type="primary" @click="createSnapshot">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as appApi from '@/api/app'
import * as lowcodeApi from '@/api/lowcode'
import * as reportApi from '@/api/report'
import * as dashboardApi from '@/api/dashboard'
import * as printApi from '@/api/print'
import * as pageApi from '@/api/page'

const route = useRoute()
const router = useRouter()
const code = route.params.code as string

const app = reactive<any>({
  code: '',
  name: '',
  category: '',
  icon: '',
  status: true,
  isMarket: true
})
const items = ref<any[]>([])
const models = ref<any[]>([])
const reports = ref<any[]>([])
const dashboards = ref<any[]>([])
const printTemplates = ref<any[]>([])
const pages = ref<any[]>([])
const resourceTabIndex = ref(0)

const resourceTabOptions = [
  { label: '模型' },
  { label: '报表' },
  { label: '仪表盘' },
  { label: '打印模板' },
  { label: '页面' }
]
const activeTab = ref('resources')
const versionVisible = ref(false)
const snapshotVisible = ref(false)
const versions = ref<any[]>([])
const snapshotForm = reactive<any>({ version: '', description: '' })
const portalConfig = reactive<any>({
  mode: 'list',
  showResources: false,
  widgets: []
})

const modeOptions = [
  { label: '资源列表', value: 'list' },
  { label: '工作台门户', value: 'portal' }
]

const widgetTypeOptions = [
  { label: '统计卡片', value: 'stat' },
  { label: '快捷链接', value: 'link' },
  { label: '仪表盘', value: 'dashboard' },
  { label: '公告', value: 'notice' },
  { label: '流程待办', value: 'pending-task' },
  { label: '应用资源', value: 'app-resources' }
]

const dataSourceTypeOptions = [
  { label: '无', value: '' },
  { label: '静态值', value: 'static' },
  { label: 'SQL', value: 'sql' },
  { label: '内部接口', value: 'api' },
  { label: '脚本', value: 'script' }
]

const colorOptions = [
  { label: '主色', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
]

const selectedColumns = [
  { prop: 'type', label: '类型' },
  { prop: 'ref_name', label: '名称' },
  { prop: 'ref_code', label: '编码' },
  { prop: 'action', label: '操作', width: 100 }
]

const versionColumns = [
  { prop: 'version', label: '版本号' },
  { prop: 'description', label: '描述' },
  { prop: 'is_published', label: '状态' },
  { prop: 'create_time', label: '创建时间' },
  { prop: 'action', label: '操作', width: 160 }
]

const typeMap: Record<string, string> = {
  model: '数据模型',
  report: '报表',
  dashboard: '仪表盘',
  flow: '流程',
  print: '打印模板',
  datasource: '外部数据源',
  page: '页面'
}

onMounted(() => loadData())

async function loadData() {
  const [appData, modelList, reportList, dashboardList, printList, pageList] = await Promise.all([
    appApi.getApp(code),
    lowcodeApi.getModels(),
    reportApi.getReports(),
    dashboardApi.getDashboards(),
    printApi.getPrintTemplates(),
    pageApi.getPages()
  ])
  Object.assign(app, appData)
  app.status = appData.status === 1
  app.isMarket = appData.is_market === 1
  items.value = appData.items || []
  models.value = modelList
  reports.value = reportList
  dashboards.value = dashboardList
  printTemplates.value = printList
  pages.value = pageList

  const config = appData.portalConfig || { mode: 'list', showResources: false, widgets: [] }
  Object.assign(portalConfig, config)
  if (!portalConfig.widgets) portalConfig.widgets = []
  for (const widget of portalConfig.widgets) {
    ensureWidgetDataSource(widget)
  }
}

function typeLabel(type: string) {
  return typeMap[type] || type
}

function addItem(type: string, refCode: string, refName: string) {
  if (items.value.some((i) => i.type === type && i.ref_code === refCode)) return
  items.value.push({
    type,
    ref_code: refCode,
    ref_name: refName,
    sort: items.value.length
  })
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}

async function handleSave() {
  await appApi.saveApp({
    id: app.id,
    code: app.code,
    name: app.name,
    category: app.category,
    icon: app.icon,
    description: app.description,
    status: app.status ? 1 : 0,
    isMarket: app.isMarket ? 1 : 0,
    items: items.value.map((i) => ({
      type: i.type,
      refCode: i.ref_code,
      refName: i.ref_name,
      sort: i.sort
    })),
    portalConfig: {
      mode: portalConfig.mode,
      showResources: portalConfig.showResources,
      widgets: portalConfig.widgets
    }
  })
  alert('保存成功')
}

function addWidget() {
  portalConfig.widgets.push({
    type: 'stat',
    title: '新组件',
    field: 'userCount',
    icon: 'star',
    color: 'primary',
    dataSource: createEmptyDataSource()
  })
}

function createEmptyDataSource() {
  return {
    type: '',
    value: '',
    sql: '',
    api: { method: 'GET', url: '', params: {}, body: {} },
    script: ''
  }
}

function ensureWidgetDataSource(widget: any) {
  if (widget.type !== 'stat') return
  if (!widget.dataSource) {
    widget.dataSource = createEmptyDataSource()
  } else {
    if (!widget.dataSource.api) {
      widget.dataSource.api = { method: 'GET', url: '', params: {}, body: {} }
    }
  }
}

function removeWidget(index: number) {
  portalConfig.widgets.splice(index, 1)
}

async function exportAppFile() {
  const blob = await appApi.exportApp(app.id)
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${app.code}.json`
  link.click()
  URL.revokeObjectURL(link.href)
}

async function openSnapshotDialog() {
  snapshotForm.version = ''
  snapshotForm.description = ''
  snapshotVisible.value = true
}

async function createSnapshot() {
  if (!snapshotForm.version) {
    alert('请输入版本号')
    return
  }
  await appApi.createSnapshot(app.id, {
    version: snapshotForm.version,
    description: snapshotForm.description
  })
  snapshotVisible.value = false
  await loadVersions()
}

async function loadVersions() {
  versions.value = await appApi.getAppVersions(app.id)
}

async function publish(row: any) {
  await appApi.publishVersion(app.id, row.id)
  alert('发布成功')
  await loadVersions()
}

async function rollback(row: any) {
  if (!confirm(`确定回滚到 ${row.version} 吗？`)) return
  await appApi.rollbackVersion(app.id, row.id)
  alert('回滚成功')
  await loadVersions()
  await loadData()
}

watch(versionVisible, (visible) => {
  if (visible) loadVersions()
})

function goBack() {
  router.back()
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; }
.main-tabs { margin-top: 12px; }
.designer-body { display: flex; gap: 12px; margin-top: 12px; }
.resource-panel, .selected-panel { flex: 1; background: #fff; border: 1px solid #ddd; padding: 12px; min-height: 400px; }
.panel-title { font-weight: bold; margin-bottom: 12px; }
.resource-list { display: flex; flex-direction: column; gap: 8px; }
.resource-item { padding: 8px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.resource-item:hover { background: #f0f0f0; }
.portal-config-panel { background: #fff; border: 1px solid #ddd; padding: 12px; min-height: 400px; }
.widget-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; margin-top: 12px; }
.widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.w-xp-textarea { width: 100%; padding: 4px 8px; border: 1px solid #d4d0c8; border-radius: 3px; font-family: inherit; }
</style>
