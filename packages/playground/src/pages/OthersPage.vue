<template>
  <div class="demo-page">
    <h1 class="page-title">{{ t('其他组件') }}</h1>
    <div class="component-grid">
      <router-link to="/others/divider" class="component-card">
        <h3>Divider 分割线</h3>
        <p>{{ t('内容分隔，支持水平和垂直') }}</p>
      </router-link>
      <router-link to="/others/watermark" class="component-card">
        <h3>Watermark 水印</h3>
        <p>{{ t('页面内容水印，防止截图泄露') }}</p>
      </router-link>
      <router-link to="/others/page-container" class="component-card">
        <h3>PageContainer 页面容器</h3>
        <p>{{ t('页面内容容器，带标题和面包屑') }}</p>
      </router-link>
      <router-link to="/others/permission" class="component-card">
        <h3>Permission 权限控制</h3>
        <p>{{ t('基于权限码控制内容显示') }}</p>
      </router-link>
      <router-link to="/others/crud-table" class="component-card">
        <h3>CrudTable 高级表格</h3>
        <p>{{ t('查询表格一体化') }}</p>
      </router-link>
      <router-link to="/others/dynamic-form" class="component-card">
        <h3>DynamicForm 动态表单</h3>
        <p>{{ t('根据配置渲染表单') }}</p>
      </router-link>
      <router-link to="/others/advanced-query-builder" class="component-card">
        <h3>AdvancedQueryBuilder 高级查询</h3>
        <p>{{ t('复杂条件分组查询') }}</p>
      </router-link>
      <router-link to="/others/page-designer" class="component-card">
        <h3>PageDesigner 页面设计器</h3>
        <p>{{ t('可视化拖拽搭建低代码页面') }}</p>
      </router-link>
      <router-link to="/others/page-renderer" class="component-card">
        <h3>PageRenderer 页面渲染器</h3>
        <p>{{ t('通过 JSON 配置渲染页面') }}</p>
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
