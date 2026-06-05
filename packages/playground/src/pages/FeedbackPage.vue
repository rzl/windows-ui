<template>
  <div class="demo-page">
    <h1 class="page-title">反馈组件</h1>
    <div class="component-grid">
      <router-link to="/feedback/alert" class="component-card">
        <h3>Alert 提示</h3>
        <p>页面级通知，用于展示重要信息</p>
      </router-link>
      <router-link to="/feedback/dialog" class="component-card">
        <h3>Dialog 对话框</h3>
        <p>模态对话框，用于重要操作确认</p>
      </router-link>
      <router-link to="/feedback/drawer" class="component-card">
        <h3>Drawer 抽屉</h3>
        <p>侧边滑出面板</p>
      </router-link>
      <router-link to="/feedback/loading" class="component-card">
        <h3>Loading 加载</h3>
        <p>加载状态覆盖</p>
      </router-link>
      <router-link to="/feedback/message" class="component-card">
        <h3>Message 消息提示</h3>
        <p>全局轻量消息通知，从顶部滑入</p>
      </router-link>
      <router-link to="/feedback/notification" class="component-card">
        <h3>Notification 通知</h3>
        <p>右上角通知提醒</p>
      </router-link>
      <router-link to="/feedback/popconfirm" class="component-card">
        <h3>Popconfirm 气泡确认框</h3>
        <p>二次确认，避免误操作</p>
      </router-link>
      <router-link to="/feedback/popover" class="component-card">
        <h3>Popover 弹出框</h3>
        <p>悬浮内容面板，比 Tooltip 更丰富</p>
      </router-link>
      <router-link to="/feedback/tooltip" class="component-card">
        <h3>Tooltip 文字提示</h3>
        <p>简短的悬浮提示</p>
      </router-link>
      <router-link to="/feedback/message-box" class="component-card">
        <h3>Message Box 消息弹出框</h3>
        <p>确认对话框，比 Dialog 更轻量</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.component-card { display: block; background: #fff; border: 2px solid; border-color: #fff #808080 #808080 #fff; padding: 16px; text-decoration: none; color: inherit; transition: transform .1s; }
.component-card:hover { transform: translateY(-2px); background: #f8f8f8; }
.component-card h3 { margin: 0 0 8px; font-size: 16px; color: #245edb; }
.component-card p { margin: 0; font-size: 12px; color: #666; }
</style>
