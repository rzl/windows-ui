<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="确认对话框，比 Dialog 更轻量" id="message-box" doc="message-box">

      <demo-block title="确认对话框" code="&lt;w-button @click=&quot;msgBoxRef?.open({ message: '确认删除此文件？' })&quot;&gt;确认框&lt;/w-button&gt;"><w-button @click="msgBoxRef?.open({ message: '确认删除此文件？' })">确认框</w-button></demo-block>
      <demo-block title="带取消按钮" code="&lt;w-button @click=&quot;msgBoxRef?.open({ message: '是否保存更改？', showCancelButton: true })&quot;&gt;保存确认&lt;/w-button&gt;"><w-button @click="msgBoxRef?.open({ message: '是否保存更改？', showCancelButton: true })">保存确认</w-button></demo-block>
      <demo-block title="自定义按钮文字" code="&lt;w-button @click=&quot;msgBoxRef?.open({ message: '提交审核？', showCancelButton: true, confirmButtonText: '提交', cancelButtonText: '再想想' })&quot;&gt;自定义文字&lt;/w-button&gt;"><w-button @click="msgBoxRef?.open({ message: '提交审核？', showCancelButton: true, confirmButtonText: '提交', cancelButtonText: '再想想' })">自定义文字</w-button></demo-block>
      <demo-block title="不同类型" code="&lt;w-space&gt;&lt;w-button @click=&quot;msgBoxRef?.open({ message: '操作成功！', type: 'success' })&quot;&gt;成功&lt;/w-button&gt;&lt;w-button @click=&quot;msgBoxRef?.open({ message: '发生错误！', type: 'error' })&quot;&gt;错误&lt;/w-button&gt;&lt;w-button @click=&quot;msgBoxRef?.open({ message: '请注意！', type: 'warning' })&quot;&gt;警告&lt;/w-button&gt;&lt;/w-space&gt;"><w-space><w-button @click="msgBoxRef?.open({ message: '操作成功！', type: 'success' })">成功</w-button><w-button @click="msgBoxRef?.open({ message: '发生错误！', type: 'error' })">错误</w-button><w-button @click="msgBoxRef?.open({ message: '请注意！', type: 'warning' })">警告</w-button></w-space></demo-block>
      <w-message-box ref="msgBoxRef" />

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

const title = 'Message Box 消息弹出框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
