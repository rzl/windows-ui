<template>
  <div class="editor-page">
    <div class="editor-form">
      <w-form :model="form" label-width="80px">
        <div class="form-row">
          <w-form-item label="编码">
            <w-input v-model="form.code" :disabled="isEdit" placeholder="唯一编码，如 user_stats" />
          </w-form-item>
          <w-form-item label="名称">
            <w-input v-model="form.name" placeholder="接口名称" />
          </w-form-item>
          <w-form-item label="方法">
            <w-select v-model="form.method" :options="methodOptions" />
          </w-form-item>
        </div>
        <div class="form-row">
          <w-form-item label="路径">
            <w-input v-model="form.path" placeholder="为空时使用编码，支持 user/stats 多层结构" />
          </w-form-item>
          <w-form-item label="公开访问">
            <w-switch v-model="form.isPublic" :active-text="'是'" :inactive-text="'否（需登录）'" />
          </w-form-item>
          <w-form-item label="状态">
            <w-switch v-model="form.status" :active-text="'启用'" :inactive-text="'禁用'" />
          </w-form-item>
        </div>
        <w-form-item label="描述">
          <w-input v-model="form.description" type="textarea" :rows="2" />
        </w-form-item>
      </w-form>
    </div>

    <custom-api-version-panel
      v-if="isEdit"
      :api-id="Number(route.params.id)"
      @rollback="reloadApi"
    />

    <div class="editor-main">
      <div class="editor-section">
        <div class="section-title">接口脚本（支持 JavaScript）</div>
        <w-monaco-editor v-model="form.script" language="javascript" :height="360" />
      </div>
      <div class="test-section">
        <div class="section-title">测试参数</div>
        <w-form label-width="60px">
          <w-form-item label="Query">
            <w-input v-model="testParams.query" type="textarea" :rows="3" placeholder="JSON 对象" />
          </w-form-item>
          <w-form-item label="Body">
            <w-input v-model="testParams.body" type="textarea" :rows="3" placeholder="JSON 对象" />
          </w-form-item>
          <w-form-item>
            <w-space>
              <w-button type="primary" @click="handleSave">保存接口</w-button>
              <w-button @click="handleTest">运行测试</w-button>
              <w-button @click="router.back()">返回</w-button>
            </w-space>
          </w-form-item>
        </w-form>

        <div v-if="testResult" class="test-result">
          <div class="section-title">测试结果</div>
          <w-alert v-if="isTestSuccess" type="success" title="执行成功" />
          <w-alert v-else type="error" :title="testResult.message || '执行失败'" />
          <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
        </div>

        <w-card header="安全配置" size="small" style="margin-top: 12px;">
          <w-form label-width="100px">
            <w-form-item label="频率限制">
              <div style="display: flex; gap: 8px;">
                <w-input-number v-model="form.rateLimit" placeholder="0 为不限制" style="flex: 1" />
                <w-select v-model="form.rateLimitWindow" :options="rateLimitWindowOptions" style="width: 120px" />
              </div>
            </w-form-item>
            <w-form-item label="IP 白名单">
              <w-input v-model="form.ipWhitelist" type="textarea" :rows="3" placeholder="每行一个 IP，支持 CIDR，如 192.168.1.0/24" />
            </w-form-item>
            <w-form-item label="IP 黑名单">
              <w-input v-model="form.ipBlacklist" type="textarea" :rows="3" placeholder="每行一个 IP，支持 CIDR" />
            </w-form-item>
            <w-form-item label="超时时间(ms)">
              <w-input-number v-model="form.timeout" :min="100" :max="60000" />
            </w-form-item>
          </w-form>
        </w-card>
      </div>
    </div>

    <w-card v-if="isEdit" header="执行日志" style="flex-shrink: 0; margin-top: 12px;">
      <w-table :data="logList" :columns="logColumns" stripe border />
      <w-pagination
        v-model:current-page="logQuery.page"
        :page-size="logQuery.pageSize"
        :total="logTotal"
        layout="prev, pager, next"
        @change="loadLogs"
      />
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as customApiApi from '@/api/customApi'
import CustomApiVersionPanel from './CustomApiVersionPanel.vue'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = reactive<any>({
  code: '',
  name: '',
  method: 'ALL',
  path: '',
  description: '',
  script: `// 可用变量：ctx, db, http, axios
// ctx 包含 params/query/body/headers/method/user/ip
// 脚本需返回一个对象
async function main() {
  const rows = await db.raw("SELECT COUNT(*) as count FROM users")
  return {
    code: 200,
    message: 'success',
    data: { userCount: rows[0]?.count || 0 }
  }
}

return await main()
`,
  isPublic: false,
  status: true,
  rateLimit: 0,
  rateLimitWindow: 'minute',
  ipWhitelist: '',
  ipBlacklist: '',
  timeout: 5000
})

const testParams = reactive({
  query: '{}',
  body: '{}'
})

const testResult = ref<any>(null)
const isTestSuccess = computed(() => {
  return testResult.value && (testResult.value.code === 200 || testResult.value.success === true)
})

const logList = ref<any[]>([])
const logTotal = ref(0)
const logQuery = reactive({ page: 1, pageSize: 10 })

const methodOptions = [
  { label: 'ALL', value: 'ALL' },
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
]

const rateLimitWindowOptions = [
  { label: '每秒', value: 'second' },
  { label: '每分钟', value: 'minute' },
  { label: '每小时', value: 'hour' },
  { label: '每天', value: 'day' }
]

const logColumns = [
  { prop: 'create_time', label: '时间', width: 160 },
  { prop: 'ip', label: 'IP', width: 130 },
  { prop: 'username', label: '用户', width: 100 },
  { prop: 'method', label: '方法', width: 80 },
  { prop: 'duration', label: '耗时(ms)', width: 90 },
  { prop: 'status', label: '状态', width: 80, formatter: (row: any) => row.status === 1 ? '成功' : '失败' },
  { prop: 'error_message', label: '错误信息', formatter: (row: any) => row.error_message || '-' }
]

onMounted(async () => {
  if (isEdit.value) {
    await reloadApi()
    await loadLogs()
  }
})

async function reloadApi() {
  const data = await customApiApi.getCustomApi(Number(route.params.id))
  form.code = data.code
  form.name = data.name
  form.method = data.method || 'ALL'
  form.path = data.path || ''
  form.description = data.description || ''
  form.script = data.script || ''
  form.isPublic = data.is_public === 1
  form.status = data.status === 1
  form.rateLimit = data.rate_limit ?? 0
  form.rateLimitWindow = data.rate_limit_window || 'minute'
  form.ipWhitelist = formatIpList(data.ip_whitelist)
  form.ipBlacklist = formatIpList(data.ip_blacklist)
  form.timeout = data.timeout ?? 5000
}

async function loadLogs() {
  if (!isEdit.value) return
  const result = await customApiApi.getCustomApiLogs(Number(route.params.id), {
    page: logQuery.page,
    pageSize: logQuery.pageSize
  })
  logList.value = result.list
  logTotal.value = result.total
}

function formatIpList(value: any): string {
  if (!value) return ''
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.join('\n')
  } catch {
    return value
  }
  return ''
}

async function handleSave() {
  try {
    const data: customApiApi.CustomApiForm = {
      code: form.code,
      name: form.name,
      method: form.method,
      path: form.path,
      description: form.description,
      script: form.script,
      isPublic: form.isPublic ? 1 : 0,
      status: form.status ? 1 : 0,
      rateLimit: Number(form.rateLimit) || 0,
      rateLimitWindow: form.rateLimitWindow,
      ipWhitelist: form.ipWhitelist,
      ipBlacklist: form.ipBlacklist,
      timeout: Number(form.timeout) || 5000
    }
    if (isEdit.value) {
      await customApiApi.updateCustomApi(Number(route.params.id), data)
    } else {
      await customApiApi.createCustomApi(data)
    }
    router.push('/lowcode/custom-api')
  } catch (error: any) {
    alert(error.message || '保存失败')
  }
}

async function handleTest() {
  try {
    const query = JSON.parse(testParams.query || '{}')
    const body = JSON.parse(testParams.body || '{}')
    let id = Number(route.params.id)

    // 新建时先临时保存以获取 id
    if (!isEdit.value) {
      const created = await customApiApi.createCustomApi({
        code: form.code || `test_${Date.now()}`,
        name: form.name || '测试接口',
        method: form.method,
        path: form.path,
        description: form.description,
        script: form.script,
        isPublic: form.isPublic ? 1 : 0,
        status: 1
      })
      id = created.id
    }

    testResult.value = await customApiApi.testCustomApi(id, { query, body })
  } catch (error: any) {
    testResult.value = { code: 500, message: error.message || '测试失败' }
  }
}
</script>

<style scoped>
.editor-page { padding: 8px; display: flex; flex-direction: column; gap: 12px; }
.editor-form { flex-shrink: 0; }
.form-row { display: flex; gap: 12px; }
.form-row .w-form-item { flex: 1; min-width: 0; }
.editor-main { flex: 1; min-height: 0; display: flex; gap: 12px; overflow: hidden; }
.editor-section { flex: 2; min-width: 0; display: flex; flex-direction: column; }
.test-section { flex: 1; min-width: 300px; overflow-y: auto; }
.section-title { font-weight: bold; margin-bottom: 8px; font-size: 14px; }
.test-result { margin-top: 12px; }
.test-result pre { padding: 8px; background: #f5f5f5; border: 1px solid #ddd; max-height: 300px; overflow: auto; font-size: 12px; }
</style>
