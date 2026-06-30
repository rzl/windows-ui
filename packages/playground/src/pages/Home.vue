<template>
  <div class="home-page">
    <w-card header="欢迎使用 Windows UI" shadow="always">
      <w-typography>
        <h2>🖥️ Windows UI - Vue 3 UI 组件库</h2>
        <p>这是一个受 <strong>Windows XP</strong> 经典风格启发的 Vue 3 UI 组件库。</p>
        <h3>✨ 特性</h3>
        <ul>
          <li>Windows XP 经典视觉风格 - 凸起/凹陷 3D 边框、渐变标题栏</li>
          <li>可自定义组件前缀（默认 <code>w-</code>），例如 <code>w-button</code>、<code>w-input</code></li>
          <li>82+ 个组件，覆盖基础、表单、数据展示、导航、反馈等场景</li>
          <li>CSS 变量主题系统，轻松修改主题色（蓝/橄榄/银色）</li>
          <li>TypeScript 支持，完整的类型定义</li>
        </ul>
        <h3>📦 安装</h3>
        <code>npm install @windows-ui/core</code>
        <h3>🔧 快速开始</h3>
        <code>import WindowsUI from '@windows-ui/core'</code>
        <br />
        <code>app.use(WindowsUI)</code>
        <h3>📁 文档结构</h3>
        <ul>
          <li><code>designs/</code> - 每个组件的设计文档（视觉/交互规范）</li>
          <li><code>develops/</code> - 每个组件的开发进度和变更记录</li>
          <li><code>docs/</code> - 每个组件的使用说明和 API 文档</li>
        </ul>
      </w-typography>
    </w-card>

    <w-divider />

    <h2 class="section-title">{{ t('组件导航') }}</h2>
    <div class="nav-grid">
      <router-link v-for="item in navCards" :key="item.path" :to="item.path" class="nav-card">
        <div class="nav-card__icon">{{ item.icon }}</div>
        <div class="nav-card__title">{{ item.title }}</div>
        <div class="nav-card__count">{{ item.count }} 个组件</div>
        <div class="nav-card__desc">{{ item.desc }}</div>
      </router-link>
    </div>

    <w-divider />

    <h2 class="section-title">{{ t('全部组件列表') }}</h2>
    <div class="overview-grid">
      <w-card v-for="group in groups" :key="group.name" :header="group.name" class="overview-card">
        <w-space wrap>
          <w-tag v-for="c in group.components" :key="c" type="info" size="small">{{ c }}</w-tag>
        </w-space>
      </w-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const navCards = [
  { path: '/basic', title: t('基础组件'), icon: '🔧', count: 13, desc: 'Button, Icon, Link, Text' },
  { path: '/form', title: t('表单组件'), icon: '📝', count: 22, desc: 'Input, Select, DatePicker' },
  { path: '/data', title: t('数据展示'), icon: '📊', count: 22, desc: 'Table, Card, Tag, Tree' },
  { path: '/nav', title: t('导航组件'), icon: '🧭', count: 9, desc: 'Menu, Tabs, Breadcrumb' },
  { path: '/feedback', title: t('反馈组件'), icon: '💬', count: 10, desc: 'Dialog, Alert, Message' },
  { path: '/others', title: t('其他组件'), icon: '📎', count: 8, desc: 'Divider, Watermark, PageContainer, Permission, CrudTable, DynamicForm, QueryBuilder, AdvancedQueryBuilder' },
]

const groups = [
  { name: t('基础组件') + ' (13)', components: ['Button','Border','Color','Container','Icon','Layout','Link','Text','Scrollbar','Space','Splitter','Typography','ConfigProvider'] },
  { name: t('表单组件') + ' (22)', components: ['Autocomplete','Cascader','Checkbox','ColorPicker','ColorPickerPanel','DatePicker','DatePickerPanel','DateTimePicker','Form','Input','InputNumber','InputTag','InputOTP','Mention','Radio','Rate','Select','VirtualizedSelect','Slider','Switch','TimePicker','TimeSelect','Transfer','TreeSelect','Upload'] },
  { name: t('数据展示') + ' (22)', components: ['Avatar','Badge','Calendar','Card','Carousel','Collapse','Descriptions','Empty','Image','InfiniteScroll','Pagination','Progress','Result','Skeleton','Table','VirtualizedTable','Tag','Timeline','Tour','Tree','VirtualizedTree','Statistic','Segmented'] },
  { name: t('导航组件') + ' (9)', components: ['Affix','Anchor','Backtop','Breadcrumb','Dropdown','Menu','PageHeader','Steps','Tabs'] },
  { name: t('反馈组件') + ' (10)', components: ['Alert','Dialog','Drawer','Loading','Message','MessageBox','Notification','Popconfirm','Popover','Tooltip'] },
  { name: t('其他组件') + ' (8)', components: ['Divider','Watermark','PageContainer','Permission','CrudTable','DynamicForm','QueryBuilder','AdvancedQueryBuilder'] },
]
</script>

<style scoped>
.home-page { padding: 8px; }
.section-title { font-size: 20px; color: var(--w-color-primary); margin: 20px 0 12px; }
.nav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; }
.nav-card { display: block; padding: 16px; background: var(--w-bg-color); border: 2px solid; border-color: var(--w-border-color-light) var(--w-border-color-dark) var(--w-border-color-dark) var(--w-border-color-light); text-decoration: none; color: var(--w-text-color-primary); transition: transform 0.15s; }
.nav-card:hover { transform: translateY(-2px); box-shadow: var(--w-box-shadow); }
.nav-card__icon { font-size: 28px; margin-bottom: 8px; }
.nav-card__title { font-size: 16px; font-weight: bold; color: var(--w-color-primary); margin-bottom: 4px; }
.nav-card__count { font-size: 12px; color: var(--w-color-success); margin-bottom: 4px; }
.nav-card__desc { font-size: 11px; color: var(--w-text-color-secondary); }
.overview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
.overview-card { margin-bottom: 0; }
</style>
