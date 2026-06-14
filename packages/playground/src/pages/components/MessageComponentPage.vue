<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('全局轻量消息通知，从顶部滑入')" id="message" doc="message">

            <demo-block :title="t('四种类型')" :code="MessageCode1">
              <w-space>
                <w-button @click="msgRef?.info('这是一条信息消息')">{{ t('信息') }}</w-button>
                <w-button @click="msgRef?.success('操作成功完成！')">{{ t('成功') }}</w-button>
                <w-button @click="msgRef?.warning('请注意此警告')">{{ t('警告') }}</w-button>
                <w-button @click="msgRef?.error('发生错误，请重试')">{{ t('错误') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('长文本消息')" :code="MessageCode2">
              <w-space>
                <w-button @click="msgRef?.info('这是一个比较长的消息文本，用于测试消息框的宽度自适应能力')">{{ t('长文本') }}</w-button>
                <w-button @click="msgRef?.success('数据保存成功！共保存了 128 条记录')">{{ t('带数据') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('自定义时长')" :code="MessageCode3">
              <w-space>
                <w-button @click="msgRef?.show('2秒后消失', 'info', 2000)">{{ t('2秒消失') }}</w-button>
                <w-button @click="msgRef?.show('5秒后消失', 'success', 5000)">{{ t('5秒消失') }}</w-button>
              </w-space>
            </demo-block>
            <!-- Message 组件实例 -->
            <w-message ref="msgRef" />

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

const title = t('Message 消息提示')

const MessageCode1 = `<w-space>
        <w-button @click="msgRef?.info('这是一条信息消息')">信息</w-button>
        <w-button @click="msgRef?.success('操作成功完成！')">成功</w-button>
        <w-button @click="msgRef?.warning('请注意此警告')">警告</w-button>
        <w-button @click="msgRef?.error('发生错误，请重试')">错误</w-button>
      </w-space>`
const MessageCode2 = `<w-space>
        <w-button @click="msgRef?.info('这是一个比较长的消息文本，用于测试消息框的宽度自适应能力')">长文本</w-button>
        <w-button @click="msgRef?.success('数据保存成功！共保存了 128 条记录')">带数据</w-button>
      </w-space>`
const MessageCode3 = `<w-space>
        <w-button @click="msgRef?.show('2秒后消失', 'info', 2000)">2秒消失</w-button>
        <w-button @click="msgRef?.show('5秒后消失', 'success', 5000)">5秒消失</w-button>
      </w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
