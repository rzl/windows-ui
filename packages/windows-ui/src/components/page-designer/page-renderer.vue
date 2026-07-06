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

    <component
      :is="dialogTag"
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      :fullscreen="dialogFullscreen"
    >
      <div :style="dialogBodyStyle">
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
      </div>
      <template v-if="dialogShowFooter" #footer>
        <component :is="buttonTag" @click="dialogVisible = false">关闭</component>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref, watch } from 'vue'

defineOptions({ name: 'WPageRenderer' })

import RenderComponent from './render-component.vue'
import './built-in-components'
import { getAction } from './plugin-manager'
import { usePrefix } from '../../utils/prefix'
import type { PageActionContext, PageConfig, PageDataSource, PageEventConfig, PageNode, PageSubPage } from './types'

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
  formData: {},
  components: []
})
const pageSubPages = reactive<PageSubPage[]>([])

const pageState = reactive<Record<string, any>>({})
const formData = reactive<Record<string, any>>({})
const dialogVisible = ref(false)
const dialogTitle = ref('弹窗')
const dialogConfig = ref<PageConfig | null>(null)
const dialogUrl = ref('')
const dialogWidth = ref<number | string>(800)
const dialogHeight = ref<number | string>('')
const dialogFullscreen = ref(false)
const dialogShowFooter = ref(true)
const refreshKey = ref(0)

const hasPagePermission = computed(() => {
  if (props.preview) return true
  if (!pageInfo.permission) return true
  return props.hasPermission ? props.hasPermission(pageInfo.permission) : true
})

const dialogBodyStyle = computed(() => {
  if (!dialogHeight.value) return {}
  return { height: typeof dialogHeight.value === 'number' ? `${dialogHeight.value}px` : dialogHeight.value, overflow: 'auto' }
})

onMounted(() => loadConfig())

watch(() => props.code, () => loadConfig())
watch(() => props.config, () => loadConfig())

async function loadConfig() {
  if (props.config) {
    pageConfig.title = props.config.title || ''
    pageConfig.description = props.config.description || ''
    pageConfig.components = props.config.components || []
    initFormData(props.config.formData || {}, pageConfig.components)
    pageSubPages.splice(0, pageSubPages.length, ...(props.config.subPages || []))
  } else if (props.code && props.loadPage) {
    const data = await props.loadPage(props.code)
    pageInfo.id = data.id
    pageInfo.code = data.code
    pageInfo.name = data.name
    pageInfo.permission = data.permission || ''
    pageConfig.title = data.config?.title || ''
    pageConfig.description = data.config?.description || ''
    pageConfig.components = data.config?.components || []
    initFormData(data.config?.formData || {}, pageConfig.components)
    pageSubPages.splice(0, pageSubPages.length, ...(data.config?.subPages || []))
  }
}

function initFormData(initial: Record<string, any>, components: PageNode[] = []) {
  // 清空旧值并写入传入的初始数据
  Object.keys(formData).forEach((key) => delete formData[key])
  Object.assign(formData, initial)
  // 扫描表单组件，未初始化的字段使用默认值
  const formTypes = new Set(['input', 'select', 'switch', 'radio', 'checkbox', 'date-picker'])
  function walk(list: PageNode[]) {
    for (const node of list) {
      if (formTypes.has(node.type) && node.props?.field) {
        const key = node.props.field
        if (!(key in formData)) {
          formData[key] = node.props.modelValue ?? ''
        }
      }
      if (node.children?.length) walk(node.children)
    }
  }
  walk(components)
}

function updateFormData(key: string, value: any) {
  formData[key] = value
}

function createEventContext() {
  return { pageState, formData }
}

function evaluateCondition(condition: string, ctx: { pageState: Record<string, any>; formData: Record<string, any> }): boolean {
  if (!condition.trim()) return true
  try {
    const fn = new Function('pageState', 'formData', `return (${condition})`)
    return !!fn(ctx.pageState, ctx.formData)
  } catch {
    return false
  }
}

async function executeEvent(event: PageEventConfig | undefined) {
  if (!event) return
  const ctx = createEventContext()

  // 链式动作：整体条件 + 依次执行每个动作
  if (event.actions && event.actions.length) {
    if (event.condition && !evaluateCondition(event.condition, ctx)) return
    for (const action of event.actions) {
      if (action.condition && !evaluateCondition(action.condition, ctx)) continue
      await executeSingleAction(action)
    }
    return
  }

  if (event.condition && !evaluateCondition(event.condition, ctx)) return
  await executeSingleAction(event)
}

function createActionContext(): PageActionContext {
  return {
    pageCode: pageCode.value,
    pageState,
    formData,
    updateFormData,
    executeDataSource: props.executeDataSource,
    refreshKey,
    emit: emit as any,
    openDialog,
    callApi
  }
}

async function executeSingleAction(event: PageEventConfig) {
  const actionDef = getAction(event.action)
  if (!actionDef) return
  await actionDef.execute(event, createActionContext())
}

async function openDialog(target: string, options?: { width?: number | string; height?: number | string; fullscreen?: boolean; showFooter?: boolean }) {
  dialogTitle.value = '弹窗'
  dialogConfig.value = null
  dialogUrl.value = ''
  dialogWidth.value = options?.width ?? 800
  dialogHeight.value = options?.height ?? ''
  dialogFullscreen.value = options?.fullscreen ?? false
  dialogShowFooter.value = options?.showFooter ?? true

  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('//')) {
    dialogUrl.value = target
  } else {
    // 优先匹配当前页面的子页面
    const subPage = pageSubPages.find((p) => p.code === target)
    if (subPage) {
      dialogTitle.value = subPage.name || '弹窗'
      dialogConfig.value = subPage.config || {}
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
  }
  dialogVisible.value = true
  emit('openDialog', { target, title: dialogTitle.value, options })
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
  formData,
  updateFormData,
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
