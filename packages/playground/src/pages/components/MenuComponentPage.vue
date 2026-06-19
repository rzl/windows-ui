<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('导航菜单')" id="menu" doc="menu">

      <demo-block :title="t('垂直菜单')" ::code="MenuCode1">
        <w-menu :items="menuItems" />
      </demo-block>

      <demo-block :title="t('水平菜单')" ::code="MenuCode2">
        <w-menu mode="horizontal" :items="menuItems" />
      </demo-block>

      <demo-block :title="t('收起模式')" ::code="MenuCode3">
        <w-menu collapse :items="menuItems" />
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
  { label: t('首页'), icon: 'home' },
  {
    label: t('产品中心'),
    icon: 'folder',
    children: [
      { label: t('产品A'), icon: 'app' },
      {
        label: t('产品B'),
        icon: 'model',
        children: [
          { label: t('B-基础版'), icon: 'file' },
          {
            label: t('B-专业版'),
            icon: 'document',
            children: [
              { label: t('专业版-详情1'), icon: 'list' },
              { label: t('专业版-详情2'), icon: 'grid' },
              { label: t('专业版-详情3'), icon: 'tag' }
            ]
          },
          { label: t('B-企业版'), icon: 'star' }
        ]
      },
      { label: t('产品C'), icon: 'cart' },
      {
        label: t('产品D'),
        icon: 'code',
        children: [
          { label: t('D-标准版'), icon: 'check' },
          {
            label: t('D-高级版'),
            icon: 'settings',
            children: [
              { label: t('高级版-功能1'), icon: 'edit' },
              { label: t('高级版-功能2'), icon: 'search' }
            ]
          }
        ]
      }
    ]
  },
  {
    label: t('解决方案'),
    icon: 'folder',
    children: [
      { label: t('金融行业'), icon: 'pie-chart' },
      {
        label: t('互联网行业'),
        icon: 'bar-chart',
        children: [
          { label: t('电商'), icon: 'cart' },
          {
            label: t('社交'),
            icon: 'user',
            children: [
              { label: t('即时通讯'), icon: 'message' },
              { label: t('社区论坛'), icon: 'notice' },
              { label: t('直播互动'), icon: 'video' }
            ]
          },
          { label: t('教育'), icon: 'bookmark' }
        ]
      },
      { label: t('制造行业'), icon: 'setting' }
    ]
  },
  {
    label: t('服务支持'),
    icon: 'folder',
    children: [
      { label: t('在线文档'), icon: 'document' },
      { label: t('视频教程'), icon: 'video' },
      {
        label: t('技术社区'),
        icon: 'message',
        children: [
          { label: t('问答区'), icon: 'help' },
          {
            label: t('博客'),
            icon: 'bookmark',
            children: [
              { label: t('前端技术'), icon: 'code' },
              { label: t('后端架构'), icon: 'database' }
            ]
          }
        ]
      }
    ]
  },
  { label: t('关于我们'), icon: 'user' }
]

const verticalCode = `<w-menu :items="[...]" />`
const horizontalCode = `<w-menu mode="horizontal" :items="[...]" />`
const collapseCode = `<w-menu collapse :items="[...]" />`

const title = t('Menu 菜单')

const MenuCode1 = `verticalCode`
const MenuCode2 = `horizontalCode`
const MenuCode3 = `collapseCode`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
