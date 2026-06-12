<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('导航菜单')" id="menu" doc="menu">

      <demo-block :title="t('垂直菜单')" :code="verticalCode">
        <w-menu :items="menuItems" />
      </demo-block>

      <demo-block :title="t('水平菜单')" :code="horizontalCode">
        <w-menu mode="horizontal" :items="menuItems" />
      </demo-block>

      <demo-block :title="t('收起模式')" :code="collapseCode">
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
      { label: t('产品A') },
      {
        label: t('产品B'),
        children: [
          { label: t('B-基础版') },
          {
            label: t('B-专业版'),
            children: [
              { label: t('专业版-详情1') },
              { label: t('专业版-详情2') },
              { label: t('专业版-详情3') }
            ]
          },
          { label: t('B-企业版') }
        ]
      },
      { label: t('产品C') },
      {
        label: t('产品D'),
        children: [
          { label: t('D-标准版') },
          {
            label: t('D-高级版'),
            children: [
              { label: t('高级版-功能1') },
              { label: t('高级版-功能2') }
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
      { label: t('金融行业') },
      {
        label: t('互联网行业'),
        children: [
          { label: t('电商') },
          {
            label: t('社交'),
            children: [
              { label: t('即时通讯') },
              { label: t('社区论坛') },
              { label: t('直播互动') }
            ]
          },
          { label: t('教育') }
        ]
      },
      { label: t('制造行业') }
    ]
  },
  {
    label: t('服务支持'),
    icon: 'folder',
    children: [
      { label: t('在线文档') },
      { label: t('视频教程') },
      {
        label: t('技术社区'),
        children: [
          { label: t('问答区') },
          {
            label: t('博客'),
            children: [
              { label: t('前端技术') },
              { label: t('后端架构') }
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
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
