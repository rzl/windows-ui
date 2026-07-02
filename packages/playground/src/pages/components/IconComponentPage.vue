<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('内置 SVG 图标')" id="icon" doc="icon">
      <demo-block
        v-for="group in iconGroups"
        :key="group.title"
        :title="group.title"
        :code="getGroupCode(group)"
      >
        <w-space wrap>
          <div v-for="name in group.names" :key="name" class="icon-demo">
            <w-icon :name="name" />
            <span class="icon-label">{{ name }}</span>
          </div>
        </w-space>
      </demo-block>

      <demo-block
        title="图标尺寸"
        :code="IconCode2"
      >
        <w-space>
          <w-icon name="search" size="small" />
          <w-icon name="search" />
          <w-icon name="search" size="large" />
        </w-space>
      </demo-block>

      <demo-block
        title="自定义 SVG"
        code='<w-space>
  <w-icon :svg="customSvg" size="large" color="#245edb" />
  <w-icon :svg="customSvg2" size="large" color="#d92b2b" />
</w-space>'
      >
        <w-space>
          <w-icon :svg="customSvg" size="large" color="#245edb" />
          <w-icon :svg="customSvg2" size="large" color="#d92b2b" />
        </w-space>
      </demo-block>
    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const title = t('Icon 图标')

const customSvg = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2 5h5l-4 3 1.5 5L8 10l-4.5 4 1.5-5-4-3h5z" fill="currentColor"/></svg>'
const customSvg2 = '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l3 3 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'

const iconGroups = [
  { title: t('方向箭头'), names: ['arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight', 'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right'] },
  { title: t('操作交互'), names: ['close', 'search', 'more', 'delete', 'edit', 'plus', 'minus', 'check', 'refresh', 'settings', 'copy', 'upload', 'download', 'print', 'share', 'zoom-in', 'zoom-out', 'lock', 'unlock', 'eye', 'eye-off'] },
  { title: t('文件系统'), names: ['folder', 'file', 'image', 'video', 'music', 'document'] },
  { title: t('状态提示'), names: ['info', 'warning', 'error', 'success', 'help', 'loading'] },
  { title: t('通用界面'), names: ['user', 'star', 'menu', 'home', 'fullscreen', 'fullscreen-exit', 'heart', 'bell', 'calendar', 'clock', 'mail', 'phone', 'link', 'tag', 'bookmark', 'filter', 'sort', 'grid', 'list'] },
  { title: t('后台管理'), names: ['computer', 'logout', 'password', 'cart', 'pie-chart', 'bar-chart', 'setting'] },
  { title: t('低代码平台'), names: ['app', 'audit', 'category', 'code', 'dashboard', 'database', 'data', 'dept', 'dict', 'flow', 'flowChart', 'log', 'market', 'message', 'model', 'monitor', 'notice', 'page', 'position', 'report', 'reportList', 'role', 'rule', 'schedule', 'server', 'task', 'template', 'validate', 'tenant', 'api', 'plugin', 'relation', 'printer', 'chart', 'arrow-right'] }
]

function getGroupCode(group: { title: string; names: string[] }) {
  return `<w-space wrap>
${group.names.map(n => `  <w-icon name="${n}" />`).join('\n')}
</w-space>`
}

const IconCode2 = `<w-space>
  <w-icon name="search" size="small" />
  <w-icon name="search" />
  <w-icon name="search" size="large" />
</w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.icon-demo { display: inline-flex; flex-direction: column; align-items: center; width: 80px; padding: 8px; }
.icon-label { margin-top: 6px; font-size: 12px; color: #666; font-family: monospace; }
</style>
