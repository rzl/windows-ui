<template>
  <div class="demo-page">
    <h1 class="page-title">其他组件</h1>
    <div class="component-grid">
      <router-link to="/others/divider" class="component-card">
        <h3>Divider 分割线</h3>
        <p>内容分隔，支持水平和垂直</p>
      </router-link>
      <router-link to="/others/watermark" class="component-card">
        <h3>Watermark 水印</h3>
        <p>页面内容水印，防止截图泄露</p>
      </router-link>
      <router-link to="/others/page-container" class="component-card">
        <h3>PageContainer 页面容器</h3>
        <p>页面内容容器，带标题和面包屑</p>
      </router-link>
      <router-link to="/others/permission" class="component-card">
        <h3>Permission 权限控制</h3>
        <p>基于权限码控制内容显示</p>
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
