<template>
  <div class="demo-page">
    <h1 class="page-title">{{ t('导航组件') }}</h1>
    <div class="component-grid">
      <router-link to="/nav/breadcrumb" class="component-card">
        <h3>Breadcrumb 面包屑</h3>
        <p>{{ t('路径导航') }}</p>
      </router-link>
      <router-link to="/nav/dropdown" class="component-card">
        <h3>Dropdown 下拉菜单</h3>
        <p>{{ t('下拉操作菜单') }}</p>
      </router-link>
      <router-link to="/nav/menu" class="component-card">
        <h3>Menu 菜单</h3>
        <p>{{ t('导航菜单') }}</p>
      </router-link>
      <router-link to="/nav/page-header" class="component-card">
        <h3>Page Header 页头</h3>
        <p>{{ t('页面标题区') }}</p>
      </router-link>
      <router-link to="/nav/steps" class="component-card">
        <h3>Steps 步骤条</h3>
        <p>{{ t('流程步骤') }}</p>
      </router-link>
      <router-link to="/nav/tabs" class="component-card">
        <h3>Tabs 标签页</h3>
        <p>{{ t('内容切换') }}</p>
      </router-link>
      <router-link to="/nav/backtop" class="component-card">
        <h3>Backtop 回到顶部</h3>
        <p>{{ t('滚动返回顶部') }}</p>
      </router-link>
      <router-link to="/nav/anchor" class="component-card">
        <h3>Anchor 锚点</h3>
        <p>{{ t('页面内跳转') }}</p>
      </router-link>
      <router-link to="/nav/affix" class="component-card">
        <h3>Affix 固钉</h3>
        <p>{{ t('固定元素') }}</p>
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
