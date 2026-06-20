<template>
  <div class="notification-center" ref="centerRef">
    <w-badge :value="app.notification.totalUnreadCount" :max="99" :hidden="app.notification.totalUnreadCount === 0">
      <w-button size="small" @click="togglePanel">
        <w-icon name="bell" size="small" />
      </w-button>
    </w-badge>

    <div v-if="panelVisible" class="notification-panel">
      <div class="panel-header">
        <span>{{ t('通知中心') }}</span>
        <w-button v-if="activeTab === 'message'" type="text" size="small" @click="handleReadAll">
          {{ t('全部已读') }}
        </w-button>
      </div>
      <w-tabs v-model="activeTab" class="panel-tabs">
        <w-tab-pane :label="`${t('待办')}(${app.notification.unreadTodoCount})`" name="todo">
          <div class="panel-list">
            <div v-if="!todos.length" class="panel-empty">{{ t('暂无待办') }}</div>
            <div
              v-for="item in todos"
              :key="item.id"
              class="panel-item"
              @click="handleTodoClick(item)"
            >
              <div class="item-title">{{ item.flow_name }} · {{ item.node_name }}</div>
              <div class="item-meta">{{ item.model_code }} #{{ item.business_key }}</div>
            </div>
          </div>
          <div class="panel-footer">
            <w-button type="text" size="small" @click="router.push('/flow/pending')">{{ t('查看全部待办') }}</w-button>
          </div>
        </w-tab-pane>
        <w-tab-pane :label="`${t('消息')}(${app.notification.unreadMessageCount})`" name="message">
          <div class="panel-list">
            <div v-if="!messages.length" class="panel-empty">{{ t('暂无未读消息') }}</div>
            <div
              v-for="item in messages"
              :key="item.id"
              class="panel-item"
              @click="handleMessageClick(item)"
            >
              <div class="item-title">
                <span class="unread-dot" />
                {{ item.title }}
              </div>
              <div class="item-meta">{{ item.content }}</div>
            </div>
          </div>
          <div class="panel-footer">
            <w-button type="text" size="small" @click="router.push('/message/list')">{{ t('查看全部消息') }}</w-button>
          </div>
        </w-tab-pane>
        <w-tab-pane :label="t('已读')" name="read">
          <div class="panel-list">
            <div v-if="!readMessages.length" class="panel-empty">{{ t('暂无已读消息') }}</div>
            <div v-for="item in readMessages" :key="item.id" class="panel-item is-read">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-meta">{{ item.content }}</div>
            </div>
          </div>
        </w-tab-pane>
      </w-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useLowcodeLocale } from '@/locale'
import * as monitorApi from '@/api/monitor'
import * as flowApi from '@/api/flow'

const router = useRouter()
const app = useAppStore()
const auth = useAuthStore()
const { t } = useLowcodeLocale()

const panelVisible = ref(false)
const activeTab = ref('todo')
const todos = ref<any[]>([])
const messages = ref<any[]>([])
const readMessages = ref<any[]>([])
const centerRef = ref<HTMLElement | null>(null)

function togglePanel() {
  panelVisible.value = !panelVisible.value
  if (panelVisible.value) {
    loadData()
  }
}

async function loadData() {
  if (!auth.userInfo?.id) return
  try {
    const [todoRes, msgRes, readRes, unreadCount] = await Promise.all([
      flowApi.getPendingTasks(),
      monitorApi.getMessages({ isRead: 0, pageSize: 10 }),
      monitorApi.getMessages({ isRead: 1, pageSize: 10 }),
      monitorApi.getUnreadCount(auth.userInfo.id)
    ])
    todos.value = todoRes || []
    messages.value = msgRes?.list || []
    readMessages.value = readRes?.list || []
    app.setNotificationState({
      unreadMessageCount: Number(unreadCount) || messages.value.length,
      unreadTodoCount: todos.value.length
    })
  } catch (error: any) {
    console.error('加载通知中心数据失败', error)
  }
}

async function handleTodoClick(_item: any) {
  panelVisible.value = false
  router.push('/flow/pending')
}

async function handleMessageClick(item: any) {
  try {
    await monitorApi.markMessageRead(item.id)
    app.setNotificationState({
      unreadMessageCount: Math.max(0, app.notification.unreadMessageCount - 1)
    })
    if (item.link) {
      router.push(item.link)
    }
    panelVisible.value = false
  } catch (error: any) {
    console.error('标记消息已读失败', error)
  }
}

async function handleReadAll() {
  if (!auth.userInfo?.id) return
  try {
    await monitorApi.readAllMessages()
    app.setNotificationState({ unreadMessageCount: 0 })
    await loadData()
  } catch (error: any) {
    console.error('一键已读失败', error)
  }
}

// 点击面板外部关闭
function handleClickOutside(event: MouseEvent) {
  if (centerRef.value && !centerRef.value.contains(event.target as Node)) {
    panelVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 首次加载计数
  loadData()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 暴露刷新方法给外部
defineExpose({ loadData })
</script>

<style scoped>
.notification-center {
  position: relative;
  display: inline-flex;
}
.notification-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-height: 420px;
  background: var(--w-bg-color);
  border: 1px solid #808080;
  box-shadow: var(--w-box-shadow);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #d4d0c8;
  font-weight: bold;
  font-size: 13px;
}
.panel-tabs {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.panel-list {
  max-height: 260px;
  overflow-y: auto;
  padding: 4px 0;
}
.panel-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.2s;
}
.panel-item:hover {
  background: #e8e8e8;
}
.panel-item.is-read {
  opacity: 0.7;
}
.item-title {
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.unread-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--w-color-danger);
  flex-shrink: 0;
}
.item-meta {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.panel-empty {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 13px;
}
.panel-footer {
  padding: 8px 12px;
  border-top: 1px solid #d4d0c8;
  text-align: center;
}
</style>
