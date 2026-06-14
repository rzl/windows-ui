<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('简短的悬浮提示')" id="tooltip" doc="tooltip">

      <demo-block :title="t('基础用法')" :code="TooltipCode1"><w-space><w-tooltip :content="t('提示文字')"><w-button>{{ t('悬停查看') }}</w-button></w-tooltip><w-tooltip :content="t('删除此项目')"><w-button icon="close" size="small" /></w-tooltip></w-space></demo-block>
      <demo-block :title="t('长提示')" :code="TooltipCode2"><w-tooltip :content="t('这是一个比较长的提示文字，用于展示多行内容的情况')"><w-button>{{ t('长提示') }}</w-button></w-tooltip></demo-block>
      <demo-block :title="t('配合图标')" :code="TooltipCode3"><w-space><w-tooltip :content="t('搜索')"><w-icon name="search" /></w-tooltip><w-tooltip :content="t('用户信息')"><w-icon name="user" /></w-tooltip></w-space></demo-block>
      <demo-block :title="t('链接提示')" :code="TooltipCode4"><w-tooltip :content="t('点击查看详情')"><w-link>悬停链接</w-link></w-tooltip></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'
const { t } = useI18n()

const dialogs = reactive({ basic: false, wide: false, mask: false, nested: false })
const drawers = reactive({ right: false, bottom: false, left: false, stay: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)

const title = t('Tooltip 文字提示')

const TooltipCode1 = `<w-space><w-tooltip content="提示文字"><w-button>悬停查看</w-button></w-tooltip><w-tooltip content="删除此项目"><w-button icon="close" size="small" /></w-tooltip></w-space>`
const TooltipCode2 = `<w-tooltip content="这是一个比较长的提示文字，用于展示多行内容的情况"><w-button>长提示</w-button></w-tooltip>`
const TooltipCode3 = `<w-space><w-tooltip content="搜索"><w-icon name="search" /></w-tooltip><w-tooltip content="用户信息"><w-icon name="user" /></w-tooltip></w-space>`
const TooltipCode4 = `<w-tooltip content="点击查看详情"><w-link>悬停链接</w-link></w-tooltip>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
