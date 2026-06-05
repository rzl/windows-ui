<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="导航菜单" id="menu" doc="menu">

      <demo-block title="垂直菜单" code="&lt;w-menu :items=&quot;[{ label: '首页', icon: 'home' }, { label: '产品', icon: 'folder', children: [{ label: '产品A' }, { label: '产品B' }] }, { label: '关于', icon: 'user' }]&quot; /&gt;"><w-menu :items="[{ label: '首页', icon: 'home' }, { label: '产品', icon: 'folder', children: [{ label: '产品A' }, { label: '产品B' }] }, { label: '关于', icon: 'user' }]" /></demo-block>
      <demo-block title="水平菜单" code="&lt;w-menu mode=&quot;horizontal&quot; :items=&quot;[{ label: '首页' }, { label: '产品', children: [{ label: 'A' }, { label: 'B' }] }, { label: '关于' }]&quot; /&gt;"><w-menu mode="horizontal" :items="[{ label: '首页' }, { label: '产品', children: [{ label: 'A' }, { label: 'B' }] }, { label: '关于' }]" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Menu 菜单'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
