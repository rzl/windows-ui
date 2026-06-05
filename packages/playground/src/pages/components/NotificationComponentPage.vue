<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="右上角通知提醒" id="notification" doc="notification">

            <demo-block title="四种类型" code="&lt;w-space&gt;
        &lt;w-button @click=&quot;notifyRef?.show({ message: '系统将于今晚维护', type: 'info' })&quot;&gt;信息&lt;/w-button&gt;
        &lt;w-button @click=&quot;notifyRef?.show({ message: '文件上传成功', type: 'success' })&quot;&gt;成功&lt;/w-button&gt;
        &lt;w-button @click=&quot;notifyRef?.show({ message: '磁盘空间不足', type: 'warning' })&quot;&gt;警告&lt;/w-button&gt;
        &lt;w-button @click=&quot;notifyRef?.show({ message: '连接超时', type: 'error' })&quot;&gt;错误&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-button @click="notifyRef?.show({ message: '系统将于今晚维护', type: 'info' })">信息</w-button>
                <w-button @click="notifyRef?.show({ message: '文件上传成功', type: 'success' })">成功</w-button>
                <w-button @click="notifyRef?.show({ message: '磁盘空间不足', type: 'warning' })">警告</w-button>
                <w-button @click="notifyRef?.show({ message: '连接超时', type: 'error' })">错误</w-button>
              </w-space>
            </demo-block>
            <demo-block title="自定义标题" code="&lt;w-space&gt;
        &lt;w-button @click=&quot;notifyRef?.show({ title: '新消息', message: '您有3条未读消息', type: 'info' })&quot;&gt;新消息&lt;/w-button&gt;
        &lt;w-button @click=&quot;notifyRef?.show({ title: '订单通知', message: '您的订单已发货', type: 'success' })&quot;&gt;订单通知&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-button @click="notifyRef?.show({ title: '新消息', message: '您有3条未读消息', type: 'info' })">新消息</w-button>
                <w-button @click="notifyRef?.show({ title: '订单通知', message: '您的订单已发货', type: 'success' })">订单通知</w-button>
              </w-space>
            </demo-block>
            <demo-block title="长内容通知" code="&lt;w-button @click=&quot;notifyRef?.show({ title: '更新说明', message: '本次更新修复了多个已知问题，优化了性能表现，建议尽快升级到最新版本。', type: 'info' })&quot;&gt;长内容&lt;/w-button&gt;">
              <w-button @click="notifyRef?.show({ title: '更新说明', message: '本次更新修复了多个已知问题，优化了性能表现，建议尽快升级到最新版本。', type: 'info' })">长内容</w-button>
            </demo-block>
            <!-- Notification 组件实例 -->
            <w-notification ref="notifyRef" />

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Notification 通知'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
