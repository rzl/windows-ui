<template>
  <div class="demo-page">
    <h1 class="page-title">{{ t('基础组件') }}</h1>
    <div class="component-grid">
      <router-link to="/basic/button" class="component-card">
        <h3>Button 按钮</h3>
        <p>{{ t('基础操作按钮，支持多种类型和尺寸') }}</p>
      </router-link>
      <router-link to="/basic/border" class="component-card">
        <h3>Border 边框</h3>
        <p>{{ t('XP 风格的边框样式') }}</p>
      </router-link>
      <router-link to="/basic/color" class="component-card">
        <h3>Color 色彩</h3>
        <p>{{ t('主题色彩展示板') }}</p>
      </router-link>
      <router-link to="/basic/container" class="component-card">
        <h3>Container 布局容器</h3>
        <p>{{ t('内容容器') }}</p>
      </router-link>
      <router-link to="/basic/icon" class="component-card">
        <h3>Icon 图标</h3>
        <p>{{ t('内置 SVG 图标') }}</p>
      </router-link>
      <router-link to="/basic/layout" class="component-card">
        <h3>Layout 布局</h3>
        <p>{{ t('Flex 布局容器') }}</p>
      </router-link>
      <router-link to="/basic/link" class="component-card">
        <h3>Link 链接</h3>
        <p>{{ t('文字链接') }}</p>
      </router-link>
      <router-link to="/basic/text" class="component-card">
        <h3>Text 文本</h3>
        <p>{{ t('文本样式组件') }}</p>
      </router-link>
      <router-link to="/basic/scrollbar" class="component-card">
        <h3>Scrollbar 滚动条</h3>
        <p>{{ t('XP 风格滚动条') }}</p>
      </router-link>
      <router-link to="/basic/space" class="component-card">
        <h3>Space 间距</h3>
        <p>{{ t('元素间距容器') }}</p>
      </router-link>
      <router-link to="/basic/splitter" class="component-card">
        <h3>Splitter 分隔面板</h3>
        <p>{{ t('可拖拽分隔的面板') }}</p>
      </router-link>
      <router-link to="/basic/typography" class="component-card">
        <h3>Typography 排版</h3>
        <p>{{ t('文章排版样式') }}</p>
      </router-link>
      <router-link to="/basic/configprovider" class="component-card">
        <h3>ConfigProvider 全局配置</h3>
        <p>{{ t('统一配置组件前缀等') }}</p>
      </router-link>
      <router-link to="/basic/admin-layout" class="component-card">
        <h3>AdminLayout 后台布局</h3>
        <p>{{ t('后台管理系统布局容器') }}</p>
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
