<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="二次确认，避免误操作" id="popconfirm" doc="popconfirm">

      <demo-block title="基础确认" code="&lt;w-popconfirm title=&quot;确认删除？&quot; @confirm=&quot;alert('已删除')&quot; @cancel=&quot;alert('已取消')&quot;&gt;&lt;w-button type=&quot;danger&quot;&gt;删除&lt;/w-button&gt;&lt;/w-popconfirm&gt;"><w-popconfirm title="确认删除？" @confirm="alert('已删除')" @cancel="alert('已取消')"><w-button type="danger">删除</w-button></w-popconfirm></demo-block>
      <demo-block title="警告类型" code="&lt;w-popconfirm title=&quot;此操作不可恢复！&quot; type=&quot;warning&quot; @confirm=&quot;alert('已确认')&quot;&gt;&lt;w-button type=&quot;warning&quot;&gt;危险操作&lt;/w-button&gt;&lt;/w-popconfirm&gt;"><w-popconfirm title="此操作不可恢复！" type="warning" @confirm="alert('已确认')"><w-button type="warning">危险操作</w-button></w-popconfirm></demo-block>
      <demo-block title="配合图标" code="&lt;w-popconfirm title=&quot;确认提交审核？&quot; @confirm=&quot;alert('已提交')&quot;&gt;&lt;w-button type=&quot;primary&quot;&gt;提交审核&lt;/w-button&gt;&lt;/w-popconfirm&gt;"><w-popconfirm title="确认提交审核？" @confirm="alert('已提交')"><w-button type="primary">提交审核</w-button></w-popconfirm></demo-block>
      <demo-block title="纯文本触发" code="&lt;w-popconfirm title=&quot;确认注销？&quot; @confirm=&quot;alert('已注销')&quot;&gt;&lt;w-link type=&quot;danger&quot;&gt;注销账号&lt;/w-link&gt;&lt;/w-popconfirm&gt;"><w-popconfirm title="确认注销？" @confirm="alert('已注销')"><w-link type="danger">注销账号</w-link></w-popconfirm></demo-block>

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

const title = 'Popconfirm 气泡确认框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
