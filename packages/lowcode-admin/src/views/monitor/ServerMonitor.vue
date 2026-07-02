<template>
  <div class="monitor-page">
    <w-card header="服务器信息">
      <w-descriptions :column="2" border>
        <w-descriptions-item label="操作系统">{{ server.platform }}</w-descriptions-item>
        <w-descriptions-item label="架构">{{ server.arch }}</w-descriptions-item>
        <w-descriptions-item label="主机名">{{ server.hostname }}</w-descriptions-item>
        <w-descriptions-item label="Node 版本">{{ server.nodeVersion }}</w-descriptions-item>
        <w-descriptions-item label="运行时长">{{ formatUptime(server.uptime) }}</w-descriptions-item>
        <w-descriptions-item label="CPU 核心数">{{ server.cpus }}</w-descriptions-item>
        <w-descriptions-item label="总内存">{{ formatBytes(server.totalMemory) }}</w-descriptions-item>
        <w-descriptions-item label="空闲内存">{{ formatBytes(server.freeMemory) }}</w-descriptions-item>
        <w-descriptions-item label="负载">{{ server.loadavg?.join(', ') }}</w-descriptions-item>
      </w-descriptions>
    </w-card>

    <w-card header="性能概览" style="margin-top: 16px;">
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-card__label">API 总请求</div>
          <div class="stat-card__value">{{ apiStats.totalCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">慢请求（>1s）</div>
          <div class="stat-card__value">{{ apiStats.slowCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">服务端错误</div>
          <div class="stat-card__value">{{ apiStats.errorCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">慢 SQL</div>
          <div class="stat-card__value">{{ sqlStats.totalCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">P95 耗时</div>
          <div class="stat-card__value">{{ formatNumber(apiStats.p95) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">P99 耗时</div>
          <div class="stat-card__value">{{ formatNumber(apiStats.p99) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">未读告警</div>
          <div class="stat-card__value">{{ unreadAlertCount }}</div>
        </div>
      </div>
    </w-card>

    <w-card header="API 请求趋势（最近 24 小时）" style="margin-top: 16px;">
      <div v-if="apiTrend.length" class="trend-chart">
        <div
          v-for="item in apiTrend"
          :key="item.time"
          class="trend-bar"
          :style="{ height: getTrendHeight(item.count) + 'px' }"
          :title="`${item.time} 请求 ${item.count} 次，平均耗时 ${item.avgDuration}ms`"
        />
      </div>
      <w-empty v-else description="暂无数据" />
    </w-card>

    <w-card header="慢接口 TOP10" style="margin-top: 16px;">
      <w-table :data="apiStats.topSlow" :columns="slowApiColumns" stripe border>
        <template #avgDuration="{ row }">{{ formatNumber(row.avgDuration) }}</template>
        <template #maxDuration="{ row }">{{ formatNumber(row.maxDuration) }}</template>
      </w-table>
    </w-card>

    <w-card header="慢 SQL" style="margin-top: 16px;">
      <w-space style="margin-bottom: 12px;">
        <w-input v-model="slowSqlQuery.keyword" placeholder="SQL 关键字" />
        <w-input-number v-model="slowSqlQuery.minDuration" placeholder="最小耗时 ms" />
        <w-button type="primary" @click="loadSlowSqls">查询</w-button>
      </w-space>
      <w-table :data="slowSqlList" :columns="slowSqlColumns" stripe border>
        <template #sql="{ row }">{{ row.sql?.slice(0, 120) }}{{ row.sql?.length > 120 ? '...' : '' }}</template>
      </w-table>
      <w-pagination
        v-model:current-page="slowSqlQuery.page"
        :page-size="slowSqlQuery.pageSize"
        :total="slowSqlTotal"
        layout="prev, pager, next"
        @change="loadSlowSqls"
      />
    </w-card>

    <w-card header="告警规则" style="margin-top: 16px;">
      <w-space style="margin-bottom: 12px;">
        <w-button type="primary" @click="openAlertRuleDialog()">+ 新增规则</w-button>
        <w-button @click="handleCheckAlerts">立即检查</w-button>
      </w-space>
      <w-table :data="alertRules" :columns="alertRuleColumns" stripe border>
        <template #type="{ row }">{{ formatAlertType(row.type) }}</template>
        <template #enabled="{ row }">{{ row.enabled ? '是' : '否' }}</template>
        <template #action="{ row }">
          <w-button size="small" @click="openAlertRuleDialog(row)">编辑</w-button>
          <w-button type="danger" size="small" @click="handleDeleteAlertRule(row.id)">删除</w-button>
        </template>
      </w-table>
    </w-card>

    <w-card header="告警记录" style="margin-top: 16px;">
      <w-table :data="alertRecords" :columns="alertRecordColumns" stripe border>
        <template #type="{ row }">{{ formatAlertType(row.type) }}</template>
        <template #status="{ row }">{{ row.status === 'resolved' ? '已解决' : '待处理' }}</template>
        <template #is_read="{ row }">{{ row.is_read ? '是' : '否' }}</template>
        <template #action="{ row }">
          <w-button size="small" @click="handleReadAlertRecord(row.id)">标为已读</w-button>
          <w-button v-if="row.status !== 'resolved'" type="primary" size="small" @click="handleResolveAlertRecord(row.id)">解决</w-button>
        </template>
      </w-table>
      <w-pagination
        v-model:current-page="alertRecordQuery.page"
        :page-size="alertRecordQuery.pageSize"
        :total="alertRecordTotal"
        layout="prev, pager, next"
        @change="loadAlertRecords"
      />
    </w-card>

    <w-card header="数据治理" style="margin-top: 16px;">
      <w-space style="margin-bottom: 12px;">
        <w-button type="primary" @click="handleRunCleanup">立即清理过期数据</w-button>
      </w-space>
      <w-table :data="retentionPolicies" :columns="retentionPolicyColumns" stripe border>
        <template #enabled="{ row }">{{ row.enabled ? '是' : '否' }}</template>
        <template #lastCleanupTime="{ row }">{{ row.lastCleanupTime || '-' }}</template>
        <template #action="{ row }">
          <w-button size="small" @click="openRetentionPolicyDialog(row)">编辑</w-button>
        </template>
      </w-table>
    </w-card>

    <w-dialog v-model="alertRuleDialogVisible" title="告警规则" width="520">
      <w-form :model="alertRuleForm">
        <w-form-item label="规则名称" required>
          <w-input v-model="alertRuleForm.name" placeholder="请输入规则名称" />
        </w-form-item>
        <w-form-item label="告警类型" required>
          <w-select v-model="alertRuleForm.type" :options="alertTypeOptions" placeholder="请选择" />
        </w-form-item>
        <w-form-item label="阈值" required>
          <w-input-number v-model="alertRuleForm.threshold" placeholder="毫秒或百分比" />
        </w-form-item>
        <w-form-item label="统计窗口（分钟）" required>
          <w-input-number v-model="alertRuleForm.windowMinutes" :min="1" />
        </w-form-item>
        <w-form-item label="通知渠道">
          <w-select v-model="alertRuleForm.notifyChannel" :options="notifyChannelOptions" />
        </w-form-item>
        <w-form-item label="启用">
          <w-switch v-model="alertRuleForm.enabled" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="alertRuleDialogVisible = false">取消</w-button>
        <w-button type="primary" @click="handleSaveAlertRule">确定</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="retentionPolicyDialogVisible" title="编辑保留策略" width="420">
      <w-form :model="retentionPolicyForm">
        <w-form-item label="数据表">
          <w-input v-model="retentionPolicyForm.tableName" disabled />
        </w-form-item>
        <w-form-item label="保留天数">
          <w-input-number v-model="retentionPolicyForm.retentionDays" :min="0" placeholder="0 表示不自动清理" />
        </w-form-item>
        <w-form-item label="启用自动清理">
          <w-switch v-model="retentionPolicyForm.enabled" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="retentionPolicyDialogVisible = false">取消</w-button>
        <w-button type="primary" @click="handleSaveRetentionPolicy">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as monitorApi from '@/api/monitor'

const server = ref<any>({})
const onlineUsers = ref<any[]>([])
const apiStats = reactive<any>({ totalCount: 0, slowCount: 0, errorCount: 0, topSlow: [] })
const sqlStats = reactive<any>({ totalCount: 0, slowCount: 0, maxDuration: 0 })
const apiTrend = ref<any[]>([])
const slowSqlList = ref<any[]>([])
const slowSqlTotal = ref(0)
const slowSqlQuery = reactive({ keyword: '', minDuration: 100, page: 1, pageSize: 10 })
const alertRules = ref<any[]>([])
const alertRecords = ref<any[]>([])
const alertRecordTotal = ref(0)
const alertRecordQuery = reactive({ page: 1, pageSize: 10 })
const unreadAlertCount = ref(0)

const alertRuleDialogVisible = ref(false)
const alertRuleForm = reactive<any>({
  id: undefined,
  name: '',
  type: 'api_slow',
  threshold: 1000,
  windowMinutes: 5,
  enabled: true,
  notifyChannel: 'site'
})

const retentionPolicies = ref<any[]>([])
const retentionPolicyDialogVisible = ref(false)
const retentionPolicyForm = reactive<any>({
  id: undefined,
  tableName: '',
  retentionDays: 30,
  enabled: true
})

const alertTypeOptions = [
  { label: '接口响应慢', value: 'api_slow' },
  { label: 'SQL 执行慢', value: 'sql_slow' },
  { label: '错误率过高', value: 'error_rate' },
  { label: '服务器负载高', value: 'server_load' }
]

const notifyChannelOptions = [
  { label: '站内信', value: 'site' },
  { label: '邮件', value: 'email' },
  { label: '短信', value: 'sms' }
]

const slowApiColumns = [
  { prop: 'path', label: '接口路径' },
  { prop: 'count', label: '请求次数' },
  { prop: 'avgDuration', label: '平均耗时（ms）' },
  { prop: 'maxDuration', label: '最大耗时（ms）' }
]

const slowSqlColumns = [
  { prop: 'sql', label: 'SQL' },
  { prop: 'duration', label: '耗时（ms）' },
  { prop: 'created_at', label: '发生时间' }
]

const alertRuleColumns = [
  { prop: 'name', label: '规则名称' },
  { prop: 'type', label: '类型' },
  { prop: 'threshold', label: '阈值' },
  { prop: 'windowMinutes', label: '窗口（分钟）' },
  { prop: 'enabled', label: '启用' },
  { prop: 'action', label: '操作' }
]

const alertRecordColumns = [
  { prop: 'rule_name', label: '规则' },
  { prop: 'type', label: '类型' },
  { prop: 'message', label: '告警内容' },
  { prop: 'status', label: '状态' },
  { prop: 'is_read', label: '已读' },
  { prop: 'create_time', label: '时间' },
  { prop: 'action', label: '操作' }
]

const retentionPolicyColumns = [
  { prop: 'tableName', label: '数据表' },
  { prop: 'retentionDays', label: '保留天数' },
  { prop: 'enabled', label: '启用' },
  { prop: 'lastCleanupTime', label: '上次清理' },
  { prop: 'action', label: '操作' }
]

onMounted(() => {
  loadData()
})

async function loadData() {
  server.value = await monitorApi.getServerInfo()
  onlineUsers.value = await monitorApi.getOnlineUsers()

  const now = new Date()
  const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const endTime = now.toISOString()

  const [apiStat, sqlStat, trend, unread] = await Promise.all([
    monitorApi.getApiPerformanceStats({ startTime, endTime }),
    monitorApi.getSqlPerformanceStats({ startTime, endTime }),
    monitorApi.getApiTrend({ startTime, endTime }),
    monitorApi.getUnreadAlertCount()
  ])

  Object.assign(apiStats, apiStat)
  Object.assign(sqlStats, sqlStat)
  apiTrend.value = trend
  unreadAlertCount.value = unread

  await Promise.all([loadSlowSqls(), loadAlertRules(), loadAlertRecords(), loadRetentionPolicies()])
}

async function loadRetentionPolicies() {
  retentionPolicies.value = await monitorApi.getRetentionPolicies()
}

function openRetentionPolicyDialog(row: any) {
  Object.assign(retentionPolicyForm, {
    id: row.id,
    tableName: row.tableName,
    retentionDays: row.retentionDays,
    enabled: row.enabled === 1
  })
  retentionPolicyDialogVisible.value = true
}

async function handleSaveRetentionPolicy() {
  await monitorApi.updateRetentionPolicy(retentionPolicyForm.id, {
    retentionDays: Number(retentionPolicyForm.retentionDays),
    enabled: retentionPolicyForm.enabled ? 1 : 0
  })
  retentionPolicyDialogVisible.value = false
  await loadRetentionPolicies()
}

async function handleRunCleanup() {
  if (!confirm('确定立即清理所有过期数据吗？此操作不可恢复。')) return
  const result = await monitorApi.runCleanup()
  alert(`清理完成：公共监控数据 ${result.total} 条，自定义接口日志 ${result.customApiTotal} 条`)
  await loadRetentionPolicies()
}

async function loadSlowSqls() {
  const result = await monitorApi.getSlowSqls({
    keyword: slowSqlQuery.keyword,
    minDuration: slowSqlQuery.minDuration,
    page: slowSqlQuery.page,
    pageSize: slowSqlQuery.pageSize
  })
  slowSqlList.value = result.list
  slowSqlTotal.value = result.total
}

async function loadAlertRules() {
  const result = await monitorApi.getAlertRules()
  alertRules.value = result.list
}

async function loadAlertRecords() {
  const result = await monitorApi.getAlertRecords({
    page: alertRecordQuery.page,
    pageSize: alertRecordQuery.pageSize
  })
  alertRecords.value = result.list
  alertRecordTotal.value = result.total
}

function getTrendHeight(count: number) {
  const max = Math.max(...apiTrend.value.map((i) => i.count), 1)
  return Math.max((count / max) * 80, 4)
}

function formatNumber(val: any) {
  return Number(val || 0).toFixed(2)
}

function formatAlertType(type: string) {
  return alertTypeOptions.find((o) => o.value === type)?.label || type
}

function openAlertRuleDialog(row?: any) {
  if (row) {
    Object.assign(alertRuleForm, row)
  } else {
    Object.assign(alertRuleForm, {
      id: undefined,
      name: '',
      type: 'api_slow',
      threshold: 1000,
      windowMinutes: 5,
      enabled: true,
      notifyChannel: 'site'
    })
  }
  alertRuleDialogVisible.value = true
}

async function handleSaveAlertRule() {
  if (!alertRuleForm.name || !alertRuleForm.type || alertRuleForm.threshold === undefined) {
    alert('请填写完整规则信息')
    return
  }
  const payload = {
    name: alertRuleForm.name,
    type: alertRuleForm.type,
    threshold: Number(alertRuleForm.threshold),
    windowMinutes: Number(alertRuleForm.windowMinutes),
    enabled: alertRuleForm.enabled ? 1 : 0,
    notifyChannel: alertRuleForm.notifyChannel
  }
  if (alertRuleForm.id) {
    await monitorApi.updateAlertRule(alertRuleForm.id, payload)
  } else {
    await monitorApi.createAlertRule(payload)
  }
  alertRuleDialogVisible.value = false
  await loadAlertRules()
}

async function handleDeleteAlertRule(id: number) {
  if (!confirm('确定删除该告警规则吗？')) return
  await monitorApi.deleteAlertRule(id)
  await loadAlertRules()
}

async function handleReadAlertRecord(id: number) {
  await monitorApi.markAlertRecordRead(id)
  await loadAlertRecords()
  const unread = await monitorApi.getUnreadAlertCount()
  unreadAlertCount.value = unread
}

async function handleResolveAlertRecord(id: number) {
  await monitorApi.resolveAlertRecord(id)
  await loadAlertRecords()
}

async function handleCheckAlerts() {
  await monitorApi.checkAlerts()
  await loadAlertRecords()
  const unread = await monitorApi.getUnreadAlertCount()
  unreadAlertCount.value = unread
  alert('检查完成')
}

function formatUptime(seconds: number) {
  if (!seconds) return '-'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}小时 ${m}分 ${s}秒`
}

function formatBytes(bytes: number) {
  if (!bytes) return '-'
  const gb = bytes / 1024 / 1024 / 1024
  return `${gb.toFixed(2)} GB`
}
</script>

<style scoped>
.monitor-page { padding: 8px; }
.stat-cards { display: flex; gap: 16px; flex-wrap: wrap; }
.stat-card { flex: 1; min-width: 140px; padding: 16px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; text-align: center; }
.stat-card__label { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); margin-bottom: 8px; }
.stat-card__value { font-size: 24px; font-weight: bold; color: var(--w-text-color-primary); }
.trend-chart { display: flex; align-items: flex-end; gap: 4px; height: 100px; padding: 8px; overflow-x: auto; }
.trend-bar { flex: 1; min-width: 8px; background: var(--w-color-primary); border-radius: 2px 2px 0 0; }
</style>
