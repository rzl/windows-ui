<template>
  <div class="list-page">
    <div class="toolbar">
      <w-button type="primary" @click="router.push('/lowcode/plugin/edit')">+ 新增插件</w-button>
      <w-button @click="installDialogVisible = true">安装示例插件</w-button>
    </div>
    <w-table :data="plugins" :columns="columns" stripe border>
      <template #type="{ row }">
        <w-tag>{{ row.type || 'mixed' }}</w-tag>
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="router.push(`/lowcode/plugin/edit/${row.id}`)">编辑</w-button>
          <w-button v-if="row.status !== 1" size="small" type="success" @click="handleEnable(row)">启用</w-button>
          <w-button v-else size="small" @click="handleDisable(row)">禁用</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-table>

    <w-dialog v-model="installDialogVisible" title="安装插件" width="620">
      <w-form label-width="100px">
        <w-form-item label="示例插件">
          <w-select v-model="selectedExample" :options="exampleOptions" placeholder="选择内置示例" @change="handleExampleChange" />
        </w-form-item>
        <w-form-item label="插件 JSON">
          <w-input v-model="installText" type="textarea" :rows="12" placeholder="粘贴插件 JSON" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="installDialogVisible = false">取消</w-button>
        <w-button type="primary" @click="handleInstall">安装</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as pluginApi from '@/api/plugin'
import { initPlugins } from '@/utils/pluginManager'

const router = useRouter()
const plugins = ref<any[]>([])
const installDialogVisible = ref(false)
const installText = ref('')
const selectedExample = ref('')

const columns = [
  { prop: 'code', label: '编码' },
  { prop: 'name', label: '名称' },
  { prop: 'version', label: '版本', width: 90 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'status', label: '状态', width: 90 },
  { prop: 'action', label: '操作', width: 260, fixed: 'right' }
]

const exampleOptions = [
  { label: '词云图表', value: 'wordcloud' },
  { label: '倒计时组件', value: 'countdown' }
]

const wordcloudPlugin = {
  code: 'example-wordcloud',
  name: '词云图表',
  version: '1.0.0',
  description: '示例：自定义词云图表',
  type: 'chart',
  contributions: {
    charts: [{ type: 'wordcloud', label: '词云' }]
  },
  runtimeCode: `export default function (api) {
  api.registerChart({
    type: 'wordcloud',
    label: '词云',
    defaultOption: () => ({
      words: [
        { name: '低代码', value: 100 },
        { name: '插件', value: 80 },
        { name: '词云', value: 60 },
        { name: 'Vue', value: 50 },
        { name: 'Node', value: 40 }
      ]
    }),
    render(option, props) {
      const words = (option?.words || []).sort((a, b) => b.value - a.value)
      const max = Math.max(...words.map((w) => w.value), 1)
      const height = props.height || '300px'
      const html = words.map((w) => {
        const size = 12 + (w.value / max) * 32
        return '<span style="display:inline-block;padding:4px 8px;font-size:' + size + 'px;opacity:' + (0.5 + w.value / max / 2) + '">' + w.name + '</span>'
      }).join('')
      return '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;height:' + height + ';}</style></head><body>' + html + '</body></html>'
    }
  })
}`
}

const countdownPlugin = {
  code: 'example-countdown',
  name: '倒计时组件',
  version: '1.0.0',
  description: '示例：倒计时显示组件',
  type: 'component',
  contributions: {
    components: [{ type: 'countdown', label: '倒计时', category: 'display', icon: 'clock' }]
  },
  runtimeCode: `export default function (api) {
  const CountdownComponent = api.defineComponent({
    props: ['node'],
    setup(props) {
      const left = api.ref(0)
      let timer = null
      function update() {
        const diff = new Date(props.node.props.target || '2026-12-31').getTime() - Date.now()
        left.value = Math.max(0, Math.floor(diff / 1000))
      }
      api.onMounted(() => {
        update()
        timer = setInterval(update, 1000)
      })
      return () => {
        const d = Math.floor(left.value / 86400)
        const h = Math.floor((left.value % 86400) / 3600)
        const m = Math.floor((left.value % 3600) / 60)
        const s = left.value % 60
        const text = (props.node.props.format || '{d}天{h}:{m}:{s}')
          .replace('{d}', d)
          .replace('{h}', h)
          .replace('{m}', m)
          .replace('{s}', s)
        return api.h('div', { style: props.node.styles }, text)
      }
    }
  })
  api.registerComponent({
    type: 'countdown',
    label: '倒计时',
    category: 'display',
    icon: 'clock',
    isContainer: false,
    defaultNode: () => ({
      type: 'countdown',
      props: { target: '2026-12-31 23:59:59', format: '还剩 {d}天 {h}时 {m}分 {s}秒' },
      styles: { fontSize: '16px', color: '#f56c6c' }
    }),
    render: (ctx) => api.h(CountdownComponent, { node: ctx.node })
  })
}`
}

onMounted(() => loadData())

async function loadData() {
  plugins.value = await pluginApi.getPlugins()
}

function handleExampleChange(value: string) {
  if (value === 'wordcloud') {
    installText.value = JSON.stringify(wordcloudPlugin, null, 2)
  } else if (value === 'countdown') {
    installText.value = JSON.stringify(countdownPlugin, null, 2)
  } else {
    installText.value = ''
  }
}

async function handleInstall() {
  try {
    const data = JSON.parse(installText.value)
    await pluginApi.createPlugin(data)
    await initPlugins()
    installDialogVisible.value = false
    installText.value = ''
    selectedExample.value = ''
    await loadData()
  } catch (error: any) {
    alert(error.message || '安装失败')
  }
}

async function handleEnable(row: any) {
  await pluginApi.enablePlugin(row.id)
  await initPlugins()
  await loadData()
}

async function handleDisable(row: any) {
  await pluginApi.disablePlugin(row.id)
  await initPlugins()
  await loadData()
}

async function handleDelete(row: any) {
  if (confirm(`确定删除插件 ${row.name} 吗？`)) {
    await pluginApi.deletePlugin(row.id)
    await initPlugins()
    await loadData()
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
