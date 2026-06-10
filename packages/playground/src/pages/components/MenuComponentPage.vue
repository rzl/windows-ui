<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="导航菜单" id="menu" doc="menu">

      <demo-block title="垂直菜单" :code="verticalCode">
        <w-menu :items="menuItems" />
      </demo-block>

      <demo-block title="水平菜单" :code="horizontalCode">
        <w-menu mode="horizontal" :items="menuItems" />
      </demo-block>

      <demo-block title="收起模式" :code="collapseCode">
        <w-menu collapse :items="menuItems" />
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const menuItems = [
  { label: '首页', icon: 'home' },
  {
    label: '产品中心',
    icon: 'folder',
    children: [
      { label: '产品A' },
      {
        label: '产品B',
        children: [
          { label: 'B-基础版' },
          {
            label: 'B-专业版',
            children: [
              { label: '专业版-详情1' },
              { label: '专业版-详情2' },
              { label: '专业版-详情3' }
            ]
          },
          { label: 'B-企业版' }
        ]
      },
      { label: '产品C' },
      {
        label: '产品D',
        children: [
          { label: 'D-标准版' },
          {
            label: 'D-高级版',
            children: [
              { label: '高级版-功能1' },
              { label: '高级版-功能2' }
            ]
          }
        ]
      }
    ]
  },
  {
    label: '解决方案',
    icon: 'folder',
    children: [
      { label: '金融行业' },
      {
        label: '互联网行业',
        children: [
          { label: '电商' },
          {
            label: '社交',
            children: [
              { label: '即时通讯' },
              { label: '社区论坛' },
              { label: '直播互动' }
            ]
          },
          { label: '教育' }
        ]
      },
      { label: '制造行业' }
    ]
  },
  {
    label: '服务支持',
    icon: 'folder',
    children: [
      { label: '在线文档' },
      { label: '视频教程' },
      {
        label: '技术社区',
        children: [
          { label: '问答区' },
          {
            label: '博客',
            children: [
              { label: '前端技术' },
              { label: '后端架构' }
            ]
          }
        ]
      }
    ]
  },
  { label: '关于我们', icon: 'user' }
]

const verticalCode = `<w-menu :items="[...]" />`
const horizontalCode = `<w-menu mode="horizontal" :items="[...]" />`
const collapseCode = `<w-menu collapse :items="[...]" />`

const title = 'Menu 菜单'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
