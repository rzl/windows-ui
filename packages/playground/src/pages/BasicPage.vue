<template>
  <div class="demo-page">
    <h1 class="page-title">基础组件</h1>
    <div class="component-grid">
      <router-link to="/basic/button" class="component-card">
        <h3>Button 按钮</h3>
        <p>基础操作按钮，支持多种类型和尺寸</p>
      </router-link>
      <router-link to="/basic/border" class="component-card">
        <h3>Border 边框</h3>
        <p>XP 风格的边框样式</p>
      </router-link>
      <router-link to="/basic/color" class="component-card">
        <h3>Color 色彩</h3>
        <p>主题色彩展示板</p>
      </router-link>
      <router-link to="/basic/container" class="component-card">
        <h3>Container 布局容器</h3>
        <p>内容容器</p>
      </router-link>
      <router-link to="/basic/icon" class="component-card">
        <h3>Icon 图标</h3>
        <p>内置 SVG 图标</p>
      </router-link>
      <router-link to="/basic/layout" class="component-card">
        <h3>Layout 布局</h3>
        <p>Flex 布局容器</p>
      </router-link>
      <router-link to="/basic/link" class="component-card">
        <h3>Link 链接</h3>
        <p>文字链接</p>
      </router-link>
      <router-link to="/basic/text" class="component-card">
        <h3>Text 文本</h3>
        <p>文本样式组件</p>
      </router-link>
      <router-link to="/basic/scrollbar" class="component-card">
        <h3>Scrollbar 滚动条</h3>
        <p>XP 风格滚动条</p>
      </router-link>
      <router-link to="/basic/space" class="component-card">
        <h3>Space 间距</h3>
        <p>元素间距容器</p>
      </router-link>
      <router-link to="/basic/splitter" class="component-card">
        <h3>Splitter 分隔面板</h3>
        <p>可拖拽分隔的面板</p>
      </router-link>
      <router-link to="/basic/typography" class="component-card">
        <h3>Typography 排版</h3>
        <p>文章排版样式</p>
      </router-link>
      <router-link to="/basic/configprovider" class="component-card">
        <h3>ConfigProvider 全局配置</h3>
        <p>统一配置组件前缀等</p>
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
