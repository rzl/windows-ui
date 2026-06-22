<template>
  <div class="editor-page">
    <div class="editor-form">
      <w-form :model="form" label-width="80px">
        <div class="form-row">
          <w-form-item label="编码">
            <w-input v-model="form.code" :disabled="isEdit" placeholder="唯一编码，如 example_plugin" />
          </w-form-item>
          <w-form-item label="名称">
            <w-input v-model="form.name" placeholder="插件名称" />
          </w-form-item>
          <w-form-item label="版本">
            <w-input v-model="form.version" placeholder="1.0.0" />
          </w-form-item>
        </div>
        <div class="form-row">
          <w-form-item label="类型">
            <w-select v-model="form.type" :options="typeOptions" />
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

    <div class="editor-main">
      <div class="editor-section">
        <div class="section-title">贡献声明（contributions JSON）</div>
        <w-monaco-editor v-model="contributionsText" language="json" :height="240" />
      </div>
      <div class="editor-section">
        <div class="section-title">运行时脚本（ES Module）</div>
        <w-monaco-editor v-model="form.runtimeCode" language="javascript" :height="240" />
      </div>
    </div>

    <div class="editor-footer">
      <w-space>
        <w-button type="primary" @click="handleSave">保存插件</w-button>
        <w-button @click="router.back()">返回</w-button>
      </w-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as pluginApi from '@/api/plugin'
import { initPlugins } from '@/utils/pluginManager'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = reactive<any>({
  code: '',
  name: '',
  version: '1.0.0',
  description: '',
  type: 'mixed',
  status: true,
  runtimeCode: `export default function (api) {
  // 示例：注册一个图表
  // api.registerChart({ type: 'my-chart', label: '我的图表', defaultOption: () => ({}), render: (option) => '<html>...</html>' })

  // 示例：注册一个页面组件
  // api.registerComponent({ type: 'my-comp', label: '我的组件', category: 'display', isContainer: false, defaultNode: () => ({}), render: (ctx) => api.h('div', {}, 'Hello') })
}
`
})

const contributionsText = ref('{}')

const typeOptions = [
  { label: '混合', value: 'mixed' },
  { label: '组件', value: 'component' },
  { label: '字段类型', value: 'field' },
  { label: '图表', value: 'chart' }
]

onMounted(async () => {
  if (isEdit.value) {
    const data = await pluginApi.getPlugin(Number(route.params.id))
    form.code = data.code
    form.name = data.name
    form.version = data.version || '1.0.0'
    form.description = data.description || ''
    form.type = data.type || 'mixed'
    form.status = data.status === 1
    form.runtimeCode = data.runtime_code || ''
    contributionsText.value = typeof data.contributions === 'string'
      ? data.contributions
      : JSON.stringify(data.contributions || {}, null, 2)
  } else {
    contributionsText.value = JSON.stringify({
      fieldTypes: [],
      charts: [],
      components: []
    }, null, 2)
  }
})

async function handleSave() {
  try {
    const contributions = JSON.parse(contributionsText.value || '{}')
    const data = {
      code: form.code,
      name: form.name,
      version: form.version,
      description: form.description,
      type: form.type,
      status: form.status ? 1 : 0,
      runtimeCode: form.runtimeCode,
      contributions
    }
    if (isEdit.value) {
      await pluginApi.updatePlugin(Number(route.params.id), data)
    } else {
      await pluginApi.createPlugin(data)
    }
    await initPlugins()
    router.push('/lowcode/plugin')
  } catch (error: any) {
    alert(error.message || '保存失败')
  }
}
</script>

<style scoped>
.editor-page { padding: 8px; height: calc(100vh - 120px); display: flex; flex-direction: column; gap: 12px; }
.editor-form { flex-shrink: 0; }
.form-row { display: flex; gap: 12px; }
.form-row .w-form-item { flex: 1; min-width: 0; }
.editor-main { flex: 1; min-height: 0; display: flex; gap: 12px; overflow: hidden; }
.editor-section { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.section-title { font-weight: bold; margin-bottom: 8px; font-size: 14px; }
.editor-footer { flex-shrink: 0; }
</style>
