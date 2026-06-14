<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('后台管理系统布局')" id="admin-layout" doc="admin-layout">

      <demo-block :title="t('基础布局')" :code="AdminLayoutCode1">
        <div style="height: 300px; overflow: hidden;">
          <w-admin-layout title="管理系统">
            <template #menu>
              <w-menu :items="menuItems" />
            </template>
            <template #header>
              <span>顶部栏</span>
            </template>
            <div>主内容区域</div>
          </w-admin-layout>
        </div>
      </demo-block>

      <demo-block :title="t('折叠侧边栏')" :code="AdminLayoutCode2">
        <div style="height: 300px; overflow: hidden;">
          <w-admin-layout title="管理系统" :collapsed="true">
            <template #menu>
              <w-menu :items="menuItems" />
            </template>
            <template #header>
              <span>顶部栏</span>
            </template>
            <div>主内容区域</div>
          </w-admin-layout>
        </div>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const menuItems = [
  { label: t('首页'), path: '/' },
  { label: t('用户管理'), path: '/user' },
  { label: t('系统设置'), path: '/setting' }
]

const title = t('AdminLayout 后台布局')

const AdminLayoutCode1 = `<w-admin-layout title="管理系统">
  <template #menu>
    <w-menu :items="menuItems" />
  </template>
  <template #header>
    <span>顶部栏</span>
  </template>
  <div>主内容区域</div>
</w-admin-layout>`
const AdminLayoutCode2 = `<w-admin-layout title="管理系统" :collapsed="true">
  <template #menu>
    <w-menu :items="menuItems" />
  </template>
  <template #header>
    <span>顶部栏</span>
  </template>
  <div>主内容区域</div>
</w-admin-layout>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
