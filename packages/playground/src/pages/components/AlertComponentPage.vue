<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="页面级通知，用于展示重要信息" id="alert" doc="alert">

            <demo-block title="四种类型" code="&lt;w-space direction=&quot;vertical&quot; style=&quot;width:100%&quot;&gt;
        &lt;w-alert title=&quot;信息提示&quot; description=&quot;这是一条普通信息消息&quot; type=&quot;info&quot; /&gt;
        &lt;w-alert title=&quot;成功提示&quot; description=&quot;操作成功完成！&quot; type=&quot;success&quot; /&gt;
        &lt;w-alert title=&quot;警告提示&quot; description=&quot;请注意此操作的潜在风险&quot; type=&quot;warning&quot; /&gt;
        &lt;w-alert title=&quot;错误提示&quot; description=&quot;操作失败，请重试&quot; type=&quot;error&quot; /&gt;
      &lt;/w-space&gt;">
              <w-space direction="vertical" style="width:100%">
                <w-alert title="信息提示" description="这是一条普通信息消息" type="info" />
                <w-alert title="成功提示" description="操作成功完成！" type="success" />
                <w-alert title="警告提示" description="请注意此操作的潜在风险" type="warning" />
                <w-alert title="错误提示" description="操作失败，请重试" type="error" />
              </w-space>
            </demo-block>
            <demo-block title="可关闭" code="&lt;w-alert title=&quot;可关闭提示&quot; description=&quot;点击右侧 X 关闭此消息&quot; type=&quot;info&quot; closable @close=&quot;alert('已关闭')&quot; /&gt;"><w-alert title="可关闭提示" description="点击右侧 X 关闭此消息" type="info" closable @close="alert('已关闭')" /></demo-block>
            <demo-block title="居中显示" code="&lt;w-alert title=&quot;居中提示&quot; description=&quot;内容居中对齐&quot; type=&quot;info&quot; center /&gt;"><w-alert title="居中提示" description="内容居中对齐" type="info" center /></demo-block>
            <demo-block title="仅标题" code="&lt;w-alert title=&quot;这是一个没有描述的提示&quot; type=&quot;success&quot; /&gt;"><w-alert title="这是一个没有描述的提示" type="success" /></demo-block>

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

const title = 'Alert 提示'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
