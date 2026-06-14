<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('右上角通知提醒')" id="notification" doc="notification">

            <demo-block :title="t('四种类型')" :code="NotificationCode1">
              <w-space>
                <w-button @click="notifyRef?.show({ message: '系统将于今晚维护', type: 'info' })">{{ t('信息') }}</w-button>
                <w-button @click="notifyRef?.show({ message: '文件上传成功', type: 'success' })">{{ t('成功') }}</w-button>
                <w-button @click="notifyRef?.show({ message: '磁盘空间不足', type: 'warning' })">{{ t('警告') }}</w-button>
                <w-button @click="notifyRef?.show({ message: '连接超时', type: 'error' })">{{ t('错误') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('自定义标题')" :code="NotificationCode2">
              <w-space>
                <w-button @click="notifyRef?.show({ title: '新消息', message: '您有3条未读消息', type: 'info' })">{{ t('新消息') }}</w-button>
                <w-button @click="notifyRef?.show({ title: '订单通知', message: '您的订单已发货', type: 'success' })">{{ t('订单通知') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('长内容通知')" :code="NotificationCode3">
              <w-button @click="notifyRef?.show({ title: '更新说明', message: '本次更新修复了多个已知问题，优化了性能表现，建议尽快升级到最新版本。', type: 'info' })">{{ t('长内容') }}</w-button>
            </demo-block>
            <!-- Notification 组件实例 -->
            <w-notification ref="notifyRef" />

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

const title = t('Notification 通知')

const NotificationCode1 = `<w-space>
        <w-button @click="notifyRef?.show({ message: '系统将于今晚维护', type: 'info' })">信息</w-button>
        <w-button @click="notifyRef?.show({ message: '文件上传成功', type: 'success' })">成功</w-button>
        <w-button @click="notifyRef?.show({ message: '磁盘空间不足', type: 'warning' })">警告</w-button>
        <w-button @click="notifyRef?.show({ message: '连接超时', type: 'error' })">错误</w-button>
      </w-space>`
const NotificationCode2 = `<w-space>
        <w-button @click="notifyRef?.show({ title: '新消息', message: '您有3条未读消息', type: 'info' })">新消息</w-button>
        <w-button @click="notifyRef?.show({ title: '订单通知', message: '您的订单已发货', type: 'success' })">订单通知</w-button>
      </w-space>`
const NotificationCode3 = `<w-button @click="notifyRef?.show({ title: '更新说明', message: '本次更新修复了多个已知问题，优化了性能表现，建议尽快升级到最新版本。', type: 'info' })">长内容</w-button>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
