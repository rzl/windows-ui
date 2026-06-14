<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('二次确认，避免误操作')" id="popconfirm" doc="popconfirm">

      <demo-block :title="t('基础确认')" :code="PopconfirmCode1"><w-popconfirm title="确认删除？" @confirm="alert('已删除')" @cancel="alert('已取消')"><w-button type="danger">{{ t('删除') }}</w-button></w-popconfirm></demo-block>
      <demo-block :title="t('警告类型')" :code="PopconfirmCode2"><w-popconfirm title="此操作不可恢复！" type="warning" @confirm="alert('已确认')"><w-button type="warning">{{ t('危险操作') }}</w-button></w-popconfirm></demo-block>
      <demo-block :title="t('配合图标')" :code="PopconfirmCode3"><w-popconfirm title="确认提交审核？" @confirm="alert('已提交')"><w-button type="primary">{{ t('提交审核') }}</w-button></w-popconfirm></demo-block>
      <demo-block :title="t('纯文本触发')" :code="PopconfirmCode4"><w-popconfirm title="确认注销？" @confirm="alert('已注销')"><w-link type="danger">注销账号</w-link></w-popconfirm></demo-block>
      <demo-block :title="t('自定义操作按钮')" :code="PopconfirmCode5">
        <w-popconfirm title="确认删除？">
          <template #action><w-button size="small" @click="alert('自定义取消')">{{ t('不了') }}</w-button><w-button size="small" type="danger" @click="alert('自定义确认')">{{ t('删除') }}</w-button></template>
          <w-button type="danger">删除</w-button>
        </w-popconfirm>
      </demo-block>

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

const title = t('Popconfirm 气泡确认框')

const PopconfirmCode1 = `<w-popconfirm title="确认删除？" @confirm="alert('已删除')" @cancel="alert('已取消')"><w-button type="danger">删除</w-button></w-popconfirm>`
const PopconfirmCode2 = `<w-popconfirm title="此操作不可恢复！" type="warning" @confirm="alert('已确认')"><w-button type="warning">危险操作</w-button></w-popconfirm>`
const PopconfirmCode3 = `<w-popconfirm title="确认提交审核？" @confirm="alert('已提交')"><w-button type="primary">提交审核</w-button></w-popconfirm>`
const PopconfirmCode4 = `<w-popconfirm title="确认注销？" @confirm="alert('已注销')"><w-link type="danger">注销账号</w-link></w-popconfirm>`
const PopconfirmCode5 = `<w-popconfirm title="确认删除？"><template #action><w-button size="small" @click="alert('自定义取消')">不了</w-button><w-button size="small" type="danger" @click="alert('自定义确认')">删除</w-button></template><w-button type="danger">删除</w-button></w-popconfirm>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
