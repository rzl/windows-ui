<template>
  <div class="designer-page">
    <div class="toolbar">
      <w-button @click="goBack">返回</w-button>
      <w-space>
        <w-button @click="previewVisible = true">预览</w-button>
        <w-button type="primary" @click="handleSave">保存</w-button>
      </w-space>
    </div>

    <div class="designer-body">
      <div class="component-panel">
        <div class="panel-title">组件</div>
        <div class="component-list">
          <div class="component-item" v-for="type in componentTypes" :key="type.value" @click="addElement(type.value)">
            {{ type.label }}
          </div>
        </div>
      </div>

      <div class="canvas-wrap">
        <div
          class="canvas"
          :style="canvasStyle"
          @mousedown="onCanvasMouseDown"
          @mousemove="onCanvasMouseMove"
          @mouseup="onCanvasMouseUp"
          @click.self="selectedId = ''"
        >
          <div
            v-for="el in elements"
            :key="el.id"
            class="element"
            :class="{ active: el.id === selectedId }"
            :style="getElementStyle(el)"
            @mousedown.stop="onElementMouseDown($event, el)"
            @click.stop="selectedId = el.id"
          >
            <div v-if="el.type === 'text'" class="el-text">{{ renderElementText(el) }}</div>
            <div v-else-if="el.type === 'rect'" class="el-rect"></div>
            <img v-else-if="el.type === 'image'" class="el-image" :src="el.content || ''" />
            <div v-else-if="el.type === 'qrcode'" class="el-qrcode">{{ el.content || 'QR' }}</div>
            <table v-else-if="el.type === 'table'" class="el-table">
              <tr><th v-for="(col, idx) in (el.tableConfig?.columns || [])" :key="idx">{{ col.label }}</th></tr>
            </table>
          </div>
        </div>
      </div>

      <div class="property-panel">
        <div class="panel-title">属性</div>
        <template v-if="selectedElement">
          <w-form :model="selectedElement" label-width="80px">
            <w-form-item label="类型">{{ selectedElement.type }}</w-form-item>
            <w-form-item label="X"><w-input-number v-model="selectedElement.x" /></w-form-item>
            <w-form-item label="Y"><w-input-number v-model="selectedElement.y" /></w-form-item>
            <w-form-item label="宽"><w-input-number v-model="selectedElement.width" /></w-form-item>
            <w-form-item label="高"><w-input-number v-model="selectedElement.height" /></w-form-item>
            <w-form-item v-if="selectedElement.type === 'text'" label="内容">
              <w-input v-model="selectedElement.content" />
            </w-form-item>
            <w-form-item v-if="selectedElement.type === 'image'" label="图片URL">
              <w-input v-model="selectedElement.content" />
            </w-form-item>
            <w-form-item v-if="selectedElement.type === 'qrcode'" label="内容">
              <w-input v-model="selectedElement.content" />
            </w-form-item>
            <w-form-item v-if="['text', 'qrcode', 'table'].includes(selectedElement.type)" label="绑定字段">
              <w-select v-model="selectedElement.field" :options="fieldOptions" clearable />
            </w-form-item>
            <w-form-item v-if="selectedElement.type === 'table'" label="表格列">
              <div v-for="(col, idx) in selectedElement.tableConfig.columns" :key="idx" class="col-row">
                <w-input v-model="col.label" placeholder="标签" />
                <w-input v-model="col.field" placeholder="字段" />
                <w-input-number v-model="col.width" placeholder="宽" />
                <w-button size="small" type="danger" @click="removeTableColumn(idx)">-</w-button>
              </div>
              <w-button size="small" @click="addTableColumn">+ 添加列</w-button>
            </w-form-item>
            <w-form-item label="样式">
              <w-input v-model="styleText" type="textarea" :rows="4" />
            </w-form-item>
          </w-form>
          <w-button type="danger" @click="removeSelected">删除元素</w-button>
        </template>
        <div v-else class="empty-tip">请选择元素</div>
      </div>
    </div>

    <w-dialog v-model="previewVisible" title="打印预览" width="900">
      <div class="preview-pages">
        <div v-for="(page, idx) in previewPages" :key="idx" class="preview-page" v-html="page.html"></div>
      </div>
      <template #footer>
        <w-button @click="previewVisible = false">关闭</w-button>
        <w-button type="primary" @click="handlePrint">打印 / 另存 PDF</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as printApi from '@/api/print'
import * as lowcodeApi from '@/api/lowcode'

const route = useRoute()
const router = useRouter()
const code = route.params.code as string

const template = reactive<any>({ code: '', name: '', modelCode: '', paperSize: 'A4', orientation: 'portrait', config: { elements: [] } })
const elements = computed(() => template.config?.elements || [])
const modelFields = ref<any[]>([])
const selectedId = ref('')
const previewVisible = ref(false)
const previewPages = ref<any[]>([])

const componentTypes = [
  { label: '文本', value: 'text' },
  { label: '图片', value: 'image' },
  { label: '表格', value: 'table' },
  { label: '矩形', value: 'rect' },
  { label: '二维码', value: 'qrcode' }
]

const canvasStyle = computed(() => {
  const size = getPaperSize(template.paperSize, template.orientation)
  return {
    width: `${size.width}px`,
    height: `${size.height}px`
  }
})

const selectedElement = computed(() => elements.value.find((e: any) => e.id === selectedId.value))
const fieldOptions = computed(() => modelFields.value.map((f: any) => ({ label: f.display_name || f.field_name, value: f.field_name })))

const styleText = computed({
  get() {
    return selectedElement.value ? JSON.stringify(selectedElement.value.style || {}, null, 2) : ''
  },
  set(val: string) {
    if (!selectedElement.value) return
    try {
      selectedElement.value.style = JSON.parse(val || '{}')
    } catch {}
  }
})

let dragEl: any = null
let dragStartX = 0
let dragStartY = 0
let elStartX = 0
let elStartY = 0

onMounted(() => loadData())

async function loadData() {
  const data = await printApi.getPrintTemplate(code)
  Object.assign(template, data)
  if (!template.config) template.config = { elements: [] }
  if (!template.config.elements) template.config.elements = []
  if (template.modelCode) {
    const model = await lowcodeApi.getModelByCode(template.modelCode)
    modelFields.value = model.fields || []
  }
}

function getPaperSize(paperSize: string, orientation: string) {
  const sizes: Record<string, { width: number; height: number }> = {
    A4: { width: 794, height: 1123 },
    A5: { width: 559, height: 794 },
    A3: { width: 1123, height: 1587 },
    LETTER: { width: 816, height: 1056 }
  }
  const size = sizes[paperSize?.toUpperCase() || 'A4'] || sizes.A4
  if (orientation === 'landscape') {
    return { width: size.height, height: size.width }
  }
  return size
}

function addElement(type: string) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const defaults: Record<string, any> = {
    text: { width: 120, height: 30, content: '文本' },
    image: { width: 100, height: 100, content: '' },
    table: { width: 400, height: 120, tableConfig: { columns: [{ label: '列1', field: '', width: 100 }], dataSource: 'main' } },
    rect: { width: 100, height: 60 },
    qrcode: { width: 80, height: 80, content: '' }
  }
  const size = getPaperSize(template.paperSize, template.orientation)
  const el = {
    id,
    type,
    x: (size.width - (defaults[type]?.width || 100)) / 2,
    y: (size.height - (defaults[type]?.height || 100)) / 4,
    width: defaults[type]?.width || 100,
    height: defaults[type]?.height || 100,
    ...defaults[type]
  }
  template.config.elements.push(el)
  selectedId.value = id
}

function removeSelected() {
  if (!selectedId.value) return
  template.config.elements = template.config.elements.filter((e: any) => e.id !== selectedId.value)
  selectedId.value = ''
}

function addTableColumn() {
  if (!selectedElement.value) return
  selectedElement.value.tableConfig.columns.push({ label: `列${selectedElement.value.tableConfig.columns.length + 1}`, field: '', width: 100 })
}

function removeTableColumn(idx: number) {
  if (!selectedElement.value) return
  selectedElement.value.tableConfig.columns.splice(idx, 1)
}

function getElementStyle(el: any) {
  return {
    position: 'absolute',
    left: `${el.x}px`,
    top: `${el.y}px`,
    width: `${el.width}px`,
    height: `${el.height}px`,
    ...(el.style || {})
  }
}

function renderElementText(el: any) {
  if (el.field) return `[${el.field}]`
  return el.content || '文本'
}

function onElementMouseDown(e: MouseEvent, el: any) {
  dragEl = el
  dragStartX = e.clientX
  dragStartY = e.clientY
  elStartX = el.x
  elStartY = el.y
  selectedId.value = el.id
}

function onCanvasMouseMove(e: MouseEvent) {
  if (!dragEl) return
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  dragEl.x = Math.max(0, elStartX + dx)
  dragEl.y = Math.max(0, elStartY + dy)
}

function onCanvasMouseUp() {
  dragEl = null
}

function onCanvasMouseDown() {
  // 点击空白处取消选择已在 @click.self 中处理
}

async function handleSave() {
  await printApi.savePrintTemplate({
    code: template.code,
    name: template.name,
    modelCode: template.modelCode,
    paperSize: template.paperSize,
    orientation: template.orientation,
    config: template.config,
    pageStyle: template.pageStyle || {},
    status: template.status ?? 1
  })
  alert('保存成功')
}

async function previewVisibleChange(visible: boolean) {
  if (!visible) return
  const res = await printApi.previewPrintTemplate(code, {})
  previewPages.value = res.pages || []
}

// 监听 previewVisible 变化以加载预览
watch(previewVisible, previewVisibleChange)

function handlePrint() {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  const pagesHtml = previewPages.value.map((p) => `<div class="print-page">${p.html}</div>`).join('')
  printWindow.document.write(`
    <html>
      <head>
        <title>打印</title>
        <style>
          body { margin: 0; padding: 20px; background: #f5f5f5; }
          .print-page { margin: 0 auto 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); page-break-after: always; }
          @media print { body { padding: 0; background: #fff; } }
        </style>
      </head>
      <body>${pagesHtml}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => printWindow.print(), 300)
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.designer-page { padding: 8px; }
.toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; }
.designer-body { display: flex; gap: 12px; height: calc(100vh - 160px); }
.component-panel, .property-panel { width: 260px; background: #fff; border: 1px solid #ddd; padding: 12px; overflow: auto; }
.panel-title { font-weight: bold; margin-bottom: 12px; }
.component-list { display: flex; flex-direction: column; gap: 8px; }
.component-item { padding: 8px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; text-align: center; }
.component-item:hover { background: #f0f0f0; }
.canvas-wrap { flex: 1; overflow: auto; background: #e0e0e0; display: flex; justify-content: center; padding: 20px; }
.canvas { background: #fff; position: relative; box-shadow: 0 0 10px rgba(0,0,0,0.15); }
.element { cursor: move; box-sizing: border-box; overflow: hidden; }
.element.active { outline: 2px dashed #1890ff; }
.el-text { width: 100%; height: 100%; display: flex; align-items: center; word-break: break-all; }
.el-rect { width: 100%; height: 100%; border: 1px solid #000; }
.el-image { width: 100%; height: 100%; object-fit: contain; }
.el-qrcode { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border: 1px solid #000; font-size: 10px; text-align: center; }
.el-table { width: 100%; border-collapse: collapse; }
.el-table th { border: 1px solid #000; background: #f0f0f0; padding: 2px 4px; }
.col-row { display: flex; gap: 4px; margin-bottom: 4px; align-items: center; }
.empty-tip { color: #999; text-align: center; margin-top: 40px; }
.preview-pages { max-height: 600px; overflow: auto; }
.preview-page { margin: 0 auto 16px; }
</style>
