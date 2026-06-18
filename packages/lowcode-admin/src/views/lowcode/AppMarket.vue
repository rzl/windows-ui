<template>
  <div class="app-market-page">
    <w-card header="应用市场">
      <w-tabs v-model="activeTab">
        <w-tab-pane label="已上架应用" name="apps">
          <div v-if="!apps.length" class="empty-tip">
            <w-empty description="暂无可用的应用" />
          </div>
          <div v-else class="app-grid">
            <div
              v-for="app in apps"
              :key="app.code"
              class="app-card"
              @click="enterApp(app)"
            >
              <div class="app-icon">
                <w-icon :name="app.icon || 'app'" />
              </div>
              <div class="app-info">
                <div class="app-name">{{ app.name }}</div>
                <div class="app-category">{{ app.category || '未分类' }}</div>
                <div class="app-desc">{{ app.description || '暂无描述' }}</div>
              </div>
              <div class="app-action">
                <w-button v-if="auth.hasPermission('lowcode:app')" size="small" @click.stop="goDesign(app)">
                  设计
                </w-button>
                <w-button type="primary" size="small" @click.stop="enterApp(app)">
                  进入
                </w-button>
              </div>
            </div>
          </div>
        </w-tab-pane>

        <w-tab-pane label="示例模板" name="templates">
          <div v-if="!templates.length" class="empty-tip">
            <w-empty description="暂无示例模板" />
          </div>
          <div v-else class="app-grid">
            <div
              v-for="tpl in templates"
              :key="tpl.code"
              class="app-card"
            >
              <div class="app-icon">
                <w-icon :name="tpl.icon || 'app'" />
              </div>
              <div class="app-info">
                <div class="app-name">{{ tpl.name }}</div>
                <div class="app-category">{{ tpl.category || '未分类' }} · v{{ tpl.version }}</div>
                <div class="app-desc">{{ tpl.description || '暂无描述' }}</div>
              </div>
              <div class="app-action">
                <w-button type="primary" size="small" @click="openInstall(tpl)">
                  安装
                </w-button>
              </div>
            </div>
          </div>
        </w-tab-pane>
      </w-tabs>
    </w-card>

    <w-dialog v-model="installVisible" title="安装示例模板" width="520">
      <w-form :model="installForm">
        <w-form-item label="应用编码">
          <w-input v-model="installForm.code" placeholder="英文编码" />
        </w-form-item>
        <w-form-item label="应用名称">
          <w-input v-model="installForm.name" />
        </w-form-item>
        <w-form-item label="自动发布">
          <w-switch v-model="installForm.autoPublish" active-text="是" inactive-text="否" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="installVisible = false">取消</w-button>
        <w-button type="primary" :loading="installing" @click="handleInstall">安装</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as appApi from '@/api/app'

const router = useRouter()
const auth = useAuthStore()
const activeTab = ref('apps')
const apps = ref<any[]>([])
const templates = ref<any[]>([])
const installVisible = ref(false)
const installing = ref(false)
const installForm = reactive<any>({
  template: '',
  code: '',
  name: '',
  autoPublish: true
})

onMounted(() => loadData())

async function loadData() {
  const [appList, templateList] = await Promise.all([
    appApi.getMarketApps(),
    appApi.getAppTemplates()
  ])
  apps.value = appList
  templates.value = templateList
}

function enterApp(app: any) {
  router.push(`/lowcode/app-run/${app.code}`)
}

function goDesign(app: any) {
  router.push(`/lowcode/app-design/${app.code}`)
}

function openInstall(tpl: any) {
  installForm.template = tpl.code
  installForm.code = tpl.code
  installForm.name = tpl.name
  installForm.autoPublish = true
  installVisible.value = true
}

async function handleInstall() {
  try {
    installing.value = true
    const res = await appApi.createAppFromTemplate({
      template: installForm.template,
      code: installForm.code,
      name: installForm.name,
      autoPublish: installForm.autoPublish
    })
    installVisible.value = false
    await loadData()

    if (installForm.autoPublish) {
      router.push(`/lowcode/app-run/${res.code}`)
    } else {
      router.push(`/lowcode/app-design/${res.code}`)
    }
  } finally {
    installing.value = false
  }
}
</script>

<style scoped>
.app-market-page { padding: 8px; }
.empty-tip { padding: 40px 0; }
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding-top: 8px;
}
.app-card {
  background: #fff;
  border: 1px solid #d4d0c8;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.app-card:hover {
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
}
.app-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 24px;
}
.app-info {
  flex: 1;
  min-width: 0;
}
.app-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
}
.app-category {
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
}
.app-desc {
  color: #999;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.app-action {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
