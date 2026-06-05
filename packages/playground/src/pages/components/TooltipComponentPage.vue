<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="简短的悬浮提示" id="tooltip" doc="tooltip">

      <demo-block title="基础用法" code="&lt;w-space&gt;&lt;w-tooltip content=&quot;提示文字&quot;&gt;&lt;w-button&gt;悬停查看&lt;/w-button&gt;&lt;/w-tooltip&gt;&lt;w-tooltip content=&quot;删除此项目&quot;&gt;&lt;w-button icon=&quot;close&quot; size=&quot;small&quot; /&gt;&lt;/w-tooltip&gt;&lt;/w-space&gt;"><w-space><w-tooltip content="提示文字"><w-button>悬停查看</w-button></w-tooltip><w-tooltip content="删除此项目"><w-button icon="close" size="small" /></w-tooltip></w-space></demo-block>
      <demo-block title="长提示" code="&lt;w-tooltip content=&quot;这是一个比较长的提示文字，用于展示多行内容的情况&quot;&gt;&lt;w-button&gt;长提示&lt;/w-button&gt;&lt;/w-tooltip&gt;"><w-tooltip content="这是一个比较长的提示文字，用于展示多行内容的情况"><w-button>长提示</w-button></w-tooltip></demo-block>
      <demo-block title="配合图标" code="&lt;w-space&gt;&lt;w-tooltip content=&quot;搜索&quot;&gt;&lt;w-icon name=&quot;search&quot; /&gt;&lt;/w-tooltip&gt;&lt;w-tooltip content=&quot;用户信息&quot;&gt;&lt;w-icon name=&quot;user&quot; /&gt;&lt;/w-tooltip&gt;&lt;/w-space&gt;"><w-space><w-tooltip content="搜索"><w-icon name="search" /></w-tooltip><w-tooltip content="用户信息"><w-icon name="user" /></w-tooltip></w-space></demo-block>
      <demo-block title="链接提示" code="&lt;w-tooltip content=&quot;点击查看详情&quot;&gt;&lt;w-link&gt;悬停链接&lt;/w-link&gt;&lt;/w-tooltip&gt;"><w-tooltip content="点击查看详情"><w-link>悬停链接</w-link></w-tooltip></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'

const dialogs = reactive({ basic: false, wide: false, mask: false, nested: false })
const drawers = reactive({ right: false, bottom: false, left: false, stay: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)

const title = 'Tooltip 文字提示'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
