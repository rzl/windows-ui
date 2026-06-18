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

      <div class="designer-body">
        <div class="resource-panel">
          <div class="panel-title">可添加资源</div>
          <w-tabs v-model="resourceTab">
            <w-tab-pane label="模型" name="models">
              <div class="resource-list">
                <div v-for="m in models" :key="m.code" class="resource-item" @click="addItem('model', m.code, m.name)">
                  {{ m.name }}
                </div>
              </div>
            </w-tab-pane>
            <w-tab-pane label="报表" name="reports">
              <div class="resource-list">
                <div v-for="r in reports" :key="r.code" class="resource-item" @click="addItem('report', r.code, r.name)">
                  {{ r.name }}
                </div>
              </div>
            </w-tab-pane>
            <w-tab-pane label="仪表盘" name="dashboards">
              <div class="resource-list">
                <div v-for="d in dashboards" :key="d.code" class="resource-item" @click="addItem('dashboard', d.code, d.name)">
                  {{ d.name }}
                </div>
              </div>
            </w-tab-pane>
            <w-tab-pane label="打印模板" name="prints">
              <div class="resource-list">
                <div v-for="p in printTemplates" :key="p.code" class="resource-item" @click="addItem('print', p.code, p.name)">
                  {{ p.name }}
                </div>
              </div>
            </w-tab-pane>
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
const resourceTab = ref('models')
const versionVisible = ref(false)
const snapshotVisible = ref(false)
const versions = ref<any[]>([])
const snapshotForm = reactive<any>({ version: '', description: '' })

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
  const [appData, modelList, reportList, dashboardList, printList] = await Promise.all([
    appApi.getApp(code),
    lowcodeApi.getModels(),
    reportApi.getReports(),
    dashboardApi.getDashboards(),
    printApi.getPrintTemplates()
  ])
  Object.assign(app, appData)
  app.status = appData.status === 1
  app.isMarket = appData.is_market === 1
  items.value = appData.items || []
  models.value = modelList
  reports.value = reportList
  dashboards.value = dashboardList
  printTemplates.value = printList
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
    }))
  })
  alert('保存成功')
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
.designer-body { display: flex; gap: 12px; margin-top: 12px; }
.resource-panel, .selected-panel { flex: 1; background: #fff; border: 1px solid #ddd; padding: 12px; min-height: 400px; }
.panel-title { font-weight: bold; margin-bottom: 12px; }
.resource-list { display: flex; flex-direction: column; gap: 8px; }
.resource-item { padding: 8px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.resource-item:hover { background: #f0f0f0; }
</style>
