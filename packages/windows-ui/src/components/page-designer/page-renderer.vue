<template>
  <div class="page-renderer">
    <component
      :is="resultTag"
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

    <component :is="dialogTag" v-model="dialogVisible" :title="dialogTitle" width="800">
      <page-renderer
        v-if="dialogConfig"
        :config="dialogConfig"
        :preview="true"
        :execute-data-source="executeDataSource"
        @navigate="handleNavigate"
        @open-dialog="handleOpenDialog"
        @call-api="handleCallApi"
      />
      <iframe
        v-else-if="dialogUrl"
        :src="dialogUrl"
        class="dialog-frame"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <template #footer>
        <component :is="buttonTag" @click="dialogVisible = false">关闭</component>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref, watch } from 'vue'

defineOptions({ name: 'WPageRenderer' })

import RenderComponent from './render-component.vue'
import { usePrefix } from '../../utils/prefix'
import type { PageConfig, PageDataSource, PageEventConfig } from './types'

const { withPrefix } = usePrefix()
const resultTag = withPrefix('result')
const dialogTag = withPrefix('dialog')
const buttonTag = withPrefix('button')

const props = defineProps<{
  code?: string
  config?: PageConfig
  preview?: boolean
  loadPage?: (code: string) => Promise<any>
  executeDataSource?: (code: string, ds: PageDataSource, ctx?: any) => Promise<any>
  hasPermission?: (code: string) => boolean
}>()

const emit = defineEmits(['navigate', 'openExternal', 'openDialog', 'callApi', 'refresh', 'back'])

const pageCode = computed(() => props.code || '')

const pageInfo = reactive<{
  id: number | null
  code: string
  name: string
  permission: string
}>({
  id: null,
  code: '',
  name: '',
  permission: ''
})

const pageConfig = reactive<PageConfig>({
  title: '',
  description: '',
  components: []
})

const pageState = reactive<Record<string, any>>({})
const dialogVisible = ref(false)
const dialogTitle = ref('弹窗')
const dialogConfig = ref<PageConfig | null>(null)
const dialogUrl = ref('')
const refreshKey = ref(0)

const hasPagePermission = computed(() => {
  if (props.preview) return true
  if (!pageInfo.permission) return true
  return props.hasPermission ? props.hasPermission(pageInfo.permission) : true
})

onMounted(() => loadConfig())

watch(() => props.code, () => loadConfig())
watch(() => props.config, () => loadConfig())

async function loadConfig() {
  if (props.config) {
    pageConfig.title = props.config.title || ''
    pageConfig.description = props.config.description || ''
    pageConfig.components = props.config.components || []
  } else if (props.code && props.loadPage) {
    const data = await props.loadPage(props.code)
    pageInfo.id = data.id
    pageInfo.code = data.code
    pageInfo.name = data.name
    pageInfo.permission = data.permission || ''
    pageConfig.title = data.config?.title || ''
    pageConfig.description = data.config?.description || ''
    pageConfig.components = data.config?.components || []
  }
}

async function executeEvent(event: PageEventConfig | undefined) {
  if (!event) return
  const { action, target, method = 'GET', params = {}, body = {}, variable = '', value = '' } = event

  switch (action) {
    case 'navigate':
      if (target) emit('navigate', target)
      break
    case 'openExternal':
      if (target) emit('openExternal', target)
      break
    case 'goBack':
      emit('back')
      break
    case 'setVariable':
      if (variable) {
        pageState[variable] = value
      }
      break
    case 'refresh':
      refreshKey.value++
      emit('refresh')
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

async function openDialog(target: string) {
  dialogTitle.value = '弹窗'
  dialogConfig.value = null
  dialogUrl.value = ''

  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('//')) {
    dialogUrl.value = target
  } else if (props.loadPage) {
    try {
      const data = await props.loadPage(target)
      dialogTitle.value = data.name || '弹窗'
      dialogConfig.value = data.config || {}
    } catch {
      dialogUrl.value = target
    }
  } else {
    dialogUrl.value = target
  }
  dialogVisible.value = true
  emit('openDialog', { target, title: dialogTitle.value })
}

async function callApi(target: string, method: string, params: any, body: any) {
  emit('callApi', { target, method, params, body })
}

function handleNavigate(target: string) {
  emit('navigate', target)
}

function handleOpenDialog(payload: any) {
  emit('openDialog', payload)
}

function handleCallApi(payload: any) {
  emit('callApi', payload)
}

provide('pageContext', {
  pageCode,
  pageState,
  executeEvent,
  executeDataSource: props.executeDataSource,
  refreshKey
})

defineExpose({ refresh: () => { refreshKey.value++ } })
</script>

<style scoped>
.page-renderer { padding: 12px; }
.dialog-frame { width: 100%; height: 500px; border: none; }
</style>
