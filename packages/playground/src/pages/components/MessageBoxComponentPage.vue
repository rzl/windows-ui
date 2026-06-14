<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('确认对话框，比 Dialog 更轻量')" id="message-box" doc="message-box">

      <demo-block :title="t('确认对话框')" :code="MessageBoxCode1"><w-button @click="msgBoxRef?.open({ message: '确认删除此文件？' })">{{ t('确认框') }}</w-button></demo-block>
      <demo-block :title="t('带取消按钮')" :code="MessageBoxCode2"><w-button @click="msgBoxRef?.open({ message: '是否保存更改？', showCancelButton: true })">{{ t('保存确认') }}</w-button></demo-block>
      <demo-block :title="t('自定义按钮文字')" :code="MessageBoxCode3"><w-button @click="msgBoxRef?.open({ message: '提交审核？', showCancelButton: true, confirmButtonText: '提交', cancelButtonText: '再想想' })">{{ t('自定义文字') }}</w-button></demo-block>
      <demo-block :title="t('不同类型')" :code="MessageBoxCode4"><w-space><w-button @click="msgBoxRef?.open({ message: '操作成功！', type: 'success' })">{{ t('成功') }}</w-button><w-button @click="msgBoxRef?.open({ message: '发生错误！', type: 'error' })">{{ t('错误') }}</w-button><w-button @click="msgBoxRef?.open({ message: '请注意！', type: 'warning' })">{{ t('警告') }}</w-button></w-space></demo-block>
      <w-message-box ref="msgBoxRef" />

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

const title = t('Message Box 消息弹出框')

const MessageBoxCode1 = `<w-button @click="msgBoxRef?.open({ message: '确认删除此文件？' })">确认框</w-button>`
const MessageBoxCode2 = `<w-button @click="msgBoxRef?.open({ message: '是否保存更改？', showCancelButton: true })">保存确认</w-button>`
const MessageBoxCode3 = `<w-button @click="msgBoxRef?.open({ message: '提交审核？', showCancelButton: true, confirmButtonText: '提交', cancelButtonText: '再想想' })">自定义文字</w-button>`
const MessageBoxCode4 = `<w-space><w-button @click="msgBoxRef?.open({ message: '操作成功！', type: 'success' })">成功</w-button><w-button @click="msgBoxRef?.open({ message: '发生错误！', type: 'error' })">错误</w-button><w-button @click="msgBoxRef?.open({ message: '请注意！', type: 'warning' })">警告</w-button></w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
