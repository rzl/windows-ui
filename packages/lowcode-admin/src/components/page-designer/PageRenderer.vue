<template>
  <div class="page-renderer">
    <w-result
      v-if="!hasPagePermission"
      icon="warning"
      title="无权访问"
      sub-title="你没有该页面的访问权限，请联系管理员申请权限。"
    />
    <template v-else>
      <render-component
        v-for="(node, index) in pageConfig.components"
        :key="node.id || index"
        :node="node"
        :page-code="pageCode"
      />
    </template>

    <w-dialog v-model="dialogVisible" :title="dialogTitle" width="800">
      <page-renderer v-if="dialogConfig" :config="dialogConfig" preview />
      <iframe
        v-else-if="dialogUrl"
        :src="dialogUrl"
        class="dialog-frame"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <template #footer>
        <w-button @click="dialogVisible = false">关闭</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'PageRenderer' })
import * as pageApi from '@/api/page'
import request from '@/api/request'
import { useAuthStore } from '@/stores/auth'
import RenderComponent from './RenderComponent.vue'

const props = defineProps<{
  code?: string
  config?: any
  preview?: boolean
}>()

const router = useRouter()
const authStore = useAuthStore()

const pageCode = computed(() => props.code || '')

const pageInfo = reactive<any>({
  id: null,
  code: '',
  name: '',
  permission: ''
})

const pageConfig = reactive<any>({
  title: '',
  description: '',
  components: []
})

const pageState = reactive<Record<string, any>>({})
const dialogVisible = ref(false)
const dialogTitle = ref('弹窗')
const dialogConfig = ref<any>(null)
const dialogUrl = ref('')

const hasPagePermission = computed(() => {
  if (props.preview) return true
  return authStore.hasPermission(pageInfo.permission)
})

onMounted(() => loadConfig())

async function loadConfig() {
  if (props.config) {
    Object.assign(pageConfig, props.config)
  } else if (props.code) {
    const data = await pageApi.getPage(props.code)
    Object.assign(pageInfo, {
      id: data.id,
      code: data.code,
      name: data.name,
      permission: data.permission || ''
    })
    Object.assign(pageConfig, data.config || {})
  }
}

async function executeEvent(event: any) {
  if (!event) return
  const { action, target, method = 'GET', params = {}, body = {}, variable = '', value = '' } = event

  switch (action) {
    case 'navigate':
      if (target) router.push(target)
      break
    case 'openExternal':
      if (target) window.open(target, '_blank')
      break
    case 'goBack':
      router.back()
      break
    case 'setVariable':
      if (variable) {
        pageState[variable] = value
      }
      break
    case 'refresh':
      // 触发所有组件重新加载数据源，通过刷新 key 实现
      refreshKey.value++
      break
    case 'openDialog':
      if (target) {
        await openDialog(target)
      }
      break
    case 'callApi':
      if (target) {
        await callApi(target, method, params, body)
      }
      break
    default:
      break
  }
}

const refreshKey = ref(0)

async function openDialog(target: string) {
  dialogTitle.value = '弹窗'
  dialogConfig.value = null
  dialogUrl.value = ''

  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('//')) {
    dialogUrl.value = target
  } else {
    try {
      const data = await pageApi.getPage(target)
      dialogTitle.value = data.name || '弹窗'
      dialogConfig.value = data.config || {}
    } catch {
      dialogUrl.value = target
    }
  }
  dialogVisible.value = true
}

async function callApi(target: string, method: string, params: any, body: any) {
  const url = target.startsWith('http') ? target : `/api${target.startsWith('/') ? '' : '/'}${target}`
  await request({
    url,
    method,
    params,
    data: body
  })
  alert('接口调用成功')
}

provide('pageContext', {
  pageCode,
  pageState,
  executeEvent,
  refreshKey
})

defineExpose({ refresh: () => { refreshKey.value++ } })
</script>

<style scoped>
.page-renderer { padding: 12px; }
.dialog-frame { width: 100%; height: 500px; border: none; }
</style>
