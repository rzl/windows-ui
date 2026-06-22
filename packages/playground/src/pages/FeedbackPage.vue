<template>
  <div class="demo-page">
    <h1 class="page-title">{{ t('反馈组件') }}</h1>
    <div class="component-grid">
      <router-link to="/feedback/alert" class="component-card">
        <h3>Alert 提示</h3>
        <p>{{ t('页面级通知，用于展示重要信息') }}</p>
      </router-link>
      <router-link to="/feedback/dialog" class="component-card">
        <h3>Dialog 对话框</h3>
        <p>{{ t('模态对话框，用于重要操作确认') }}</p>
      </router-link>
      <router-link to="/feedback/drawer" class="component-card">
        <h3>Drawer 抽屉</h3>
        <p>{{ t('侧边滑出面板') }}</p>
      </router-link>
      <router-link to="/feedback/loading" class="component-card">
        <h3>Loading 加载</h3>
        <p>{{ t('加载状态覆盖') }}</p>
      </router-link>
      <router-link to="/feedback/message" class="component-card">
        <h3>Message 消息提示</h3>
        <p>{{ t('全局轻量消息通知，从顶部滑入') }}</p>
      </router-link>
      <router-link to="/feedback/notification" class="component-card">
        <h3>Notification 通知</h3>
        <p>{{ t('右上角通知提醒') }}</p>
      </router-link>
      <router-link to="/feedback/popconfirm" class="component-card">
        <h3>Popconfirm 气泡确认框</h3>
        <p>{{ t('二次确认，避免误操作') }}</p>
      </router-link>
      <router-link to="/feedback/popover" class="component-card">
        <h3>Popover 弹出框</h3>
        <p>{{ t('悬浮内容面板，比 Tooltip 更丰富') }}</p>
      </router-link>
      <router-link to="/feedback/tooltip" class="component-card">
        <h3>Tooltip 文字提示</h3>
        <p>{{ t('简短的悬浮提示') }}</p>
      </router-link>
      <router-link to="/feedback/message-box" class="component-card">
        <h3>Message Box 消息弹出框</h3>
        <p>{{ t('确认对话框，比 Dialog 更轻量') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.page-title { font-size: 24px; color: var(--w-color-primary); margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid var(--w-border-color); }
.component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.component-card { display: block; background: var(--w-bg-color); border: 2px solid; border-color: var(--w-border-color-light) var(--w-border-color-dark) var(--w-border-color-dark) var(--w-border-color-light); padding: 16px; text-decoration: none; color: inherit; transition: transform .1s; }
.component-card:hover { transform: translateY(-2px); background: var(--w-fill-color); }
.component-card h3 { margin: 0 0 8px; font-size: 16px; color: var(--w-color-primary); }
.component-card p { margin: 0; font-size: 12px; color: var(--w-text-color-secondary); }
</style>
