<template>
  <div class="demo-page">
    <h1 class="page-title">导航组件</h1>
    <div class="component-grid">
      <router-link to="/nav/breadcrumb" class="component-card">
        <h3>Breadcrumb 面包屑</h3>
        <p>路径导航</p>
      </router-link>
      <router-link to="/nav/dropdown" class="component-card">
        <h3>Dropdown 下拉菜单</h3>
        <p>下拉操作菜单</p>
      </router-link>
      <router-link to="/nav/menu" class="component-card">
        <h3>Menu 菜单</h3>
        <p>导航菜单</p>
      </router-link>
      <router-link to="/nav/page-header" class="component-card">
        <h3>Page Header 页头</h3>
        <p>页面标题区</p>
      </router-link>
      <router-link to="/nav/steps" class="component-card">
        <h3>Steps 步骤条</h3>
        <p>流程步骤</p>
      </router-link>
      <router-link to="/nav/tabs" class="component-card">
        <h3>Tabs 标签页</h3>
        <p>内容切换</p>
      </router-link>
      <router-link to="/nav/backtop" class="component-card">
        <h3>Backtop 回到顶部</h3>
        <p>滚动返回顶部</p>
      </router-link>
      <router-link to="/nav/anchor" class="component-card">
        <h3>Anchor 锚点</h3>
        <p>页面内跳转</p>
      </router-link>
      <router-link to="/nav/affix" class="component-card">
        <h3>Affix 固钉</h3>
        <p>固定元素</p>
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
