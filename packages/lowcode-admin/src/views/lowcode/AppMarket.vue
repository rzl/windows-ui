<template>
  <div class="app-market-page">
    <w-card header="应用市场">
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
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as appApi from '@/api/app'

const router = useRouter()
const auth = useAuthStore()
const apps = ref<any[]>([])

onMounted(() => loadData())

async function loadData() {
  apps.value = await appApi.getMarketApps()
}

function enterApp(app: any) {
  router.push(`/lowcode/app-run/${app.code}`)
}

function goDesign(app: any) {
  router.push(`/lowcode/app-design/${app.code}`)
}
</script>

<style scoped>
.app-market-page { padding: 8px; }
.empty-tip { padding: 40px 0; }
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
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
