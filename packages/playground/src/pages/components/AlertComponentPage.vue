<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('页面级通知，用于展示重要信息')" id="alert" doc="alert">

            <demo-block :title="t('四种类型')" :code="AlertCode1">
              <w-space direction="vertical" style="width:100%">
                <w-alert title="信息提示" :description="t('这是一条普通信息消息')" type="info" />
                <w-alert title="成功提示" :description="t('操作成功完成！')" type="success" />
                <w-alert title="警告提示" :description="t('请注意此操作的潜在风险')" type="warning" />
                <w-alert title="错误提示" :description="t('操作失败，请重试')" type="error" />
              </w-space>
            </demo-block>
            <demo-block :title="t('可关闭')" :code="AlertCode2"><w-alert title="可关闭提示" :description="t('点击右侧 X 关闭此消息')" type="info" closable @close="alert('已关闭')" /></demo-block>
            <demo-block :title="t('居中显示')" :code="AlertCode3"><w-alert title="居中提示" :description="t('内容居中对齐')" type="info" center /></demo-block>
            <demo-block :title="t('仅标题')" :code="AlertCode4"><w-alert title="这是一个没有描述的提示" type="success" /></demo-block>
            <demo-block :title="t('自定义标题')" :code="AlertCode5">
              <w-alert type="info">
                <template #title><w-icon name="warning" size="small" style="margin-right:4px" /><span>自定义标题</span></template>
                <template #default>使用 title 插槽自定义标题内容。</template>
              </w-alert>
            </demo-block>
            <demo-block :title="t('自定义操作')" :code="AlertCode6">
              <w-alert title="可执行操作" type="info" closable>
                <template #action><w-link type="primary" style="font-size:12px">查看详情</w-link></template>
                使用 action 插槽在关闭按钮左侧插入自定义操作。
              </w-alert>
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

const title = t('Alert 提示')

const AlertCode1 = `<w-space direction="vertical" style="width:100%">
        <w-alert title="信息提示" description="这是一条普通信息消息" type="info" />
        <w-alert title="成功提示" description="操作成功完成！" type="success" />
        <w-alert title="警告提示" description="请注意此操作的潜在风险" type="warning" />
        <w-alert title="错误提示" description="操作失败，请重试" type="error" />
      </w-space>`
const AlertCode2 = `<w-alert title="可关闭提示" description="点击右侧 X 关闭此消息" type="info" closable @close="alert('已关闭')" />`
const AlertCode3 = `<w-alert title="居中提示" description="内容居中对齐" type="info" center />`
const AlertCode4 = `<w-alert title="这是一个没有描述的提示" type="success" />`
const AlertCode5 = `<w-alert type="info"><template #title><w-icon name="warning" size="small" style="margin-right:4px" /><span>自定义标题</span></template><template #default>使用 title 插槽自定义标题内容。</template></w-alert>`
const AlertCode6 = `<w-alert title="可执行操作" type="info" closable><template #action><w-link type="primary" style="font-size:12px">查看详情</w-link></template>使用 action 插槽在关闭按钮左侧插入自定义操作。</w-alert>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
