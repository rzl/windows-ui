<template>
  <div class="demo-page">
    <h1 class="page-title">💬 Feedback 反馈组件</h1>

    <demo-section title="Alert 提示" description="页面级通知">
      <demo-block title="不同类型">
        <w-space direction="vertical" style="width:100%">
          <w-alert title="信息提示" description="这是一条信息" type="info" />
          <w-alert title="成功提示" description="操作成功" type="success" />
          <w-alert title="警告提示" description="请注意" type="warning" />
          <w-alert title="错误提示" description="发生错误" type="error" />
        </w-space>
      </demo-block>
      <demo-block title="可关闭"><w-alert title="可关闭" description="点击右侧关闭" closable @close="alert('已关闭')" /></demo-block>
      <demo-block title="居中"><w-alert title="居中提示" type="info" center /></demo-block>
    </demo-section>

    <demo-section title="Dialog 对话框" description="模态对话框">
      <demo-block title="基础对话框">
        <w-button @click="showDialog = true">打开对话框</w-button>
        <w-dialog v-model="showDialog" title="对话框标题"><p>这是对话框内容</p><template #footer><w-button @click="showDialog = false">取消</w-button><w-button type="primary" @click="showDialog = false">确定</w-button></template></w-dialog>
      </demo-block>
    </demo-section>

    <demo-section title="Drawer 抽屉" description="侧边滑出面板">
      <demo-block title="右侧抽屉">
        <w-button @click="showDrawer = true">打开抽屉</w-button>
        <w-drawer v-model="showDrawer" title="抽屉标题"><p>抽屉内容区域</p></w-drawer>
      </demo-block>
      <demo-block title="底部抽屉">
        <w-button @click="showDrawerBottom = true">底部抽屉</w-button>
        <w-drawer v-model="showDrawerBottom" title="底部标题" direction="bottom" size="200px"><p>从底部滑出</p></w-drawer>
      </demo-block>
    </demo-section>

    <demo-section title="Loading 加载" description="加载状态覆盖">
      <demo-block title="基础用法">
        <div style="position:relative;height:80px;border:1px solid #d4d0c8">
          <w-loading :visible="true" text="加载中..." />
        </div>
      </demo-block>
    </demo-section>

    <demo-section title="Message 消息提示" description="全局消息通知">
      <demo-block title="不同类型">
        <w-space>
          <w-button @click="showMessage('info', '信息消息')">信息</w-button>
          <w-button @click="showMessage('success', '成功消息')">成功</w-button>
          <w-button @click="showMessage('warning', '警告消息')">警告</w-button>
          <w-button @click="showMessage('error', '错误消息')">错误</w-button>
        </w-space>
      </demo-block>
    </demo-section>

    <demo-section title="Notification 通知" description="右上角通知">
      <demo-block title="基础用法">
        <w-space>
          <w-button @click="showNotify('info')">信息通知</w-button>
          <w-button @click="showNotify('success')">成功通知</w-button>
          <w-button @click="showNotify('warning')">警告通知</w-button>
          <w-button @click="showNotify('error')">错误通知</w-button>
        </w-space>
      </demo-block>
    </demo-section>

    <demo-section title="Popconfirm 气泡确认框" description="二次确认">
      <demo-block title="基础用法"><w-popconfirm title="确认删除？" @confirm="alert('已删除')" @cancel="alert('已取消')"><w-button type="danger">删除</w-button></w-popconfirm></demo-block>
    </demo-section>

    <demo-section title="Popover 弹出框" description="悬浮内容面板">
      <demo-block title="基础用法"><w-popover title="标题" content="这是弹出框内容"><w-button>点击弹出</w-button></w-popover></demo-block>
      <demo-block title="hover 触发"><w-popover title="提示" content="hover 触发内容" trigger="hover"><w-button>hover 触发</w-button></w-popover></demo-block>
    </demo-section>

    <demo-section title="Tooltip 文字提示" description="简短提示">
      <demo-block title="基础用法"><w-tooltip content="这是提示文字"><w-button>悬停查看</w-button></w-tooltip></demo-block>
    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../components/DemoSection.vue'
import DemoBlock from '../components/DemoBlock.vue'

const showDialog = ref(false)
const showDrawer = ref(false)
const showDrawerBottom = ref(false)

const alert = (msg: string) => window.alert(msg)
const showMessage = (type: string, msg: string) => alert(`[${type}] ${msg}`)
const showNotify = (type: string) => alert(`通知: ${type}`)
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
