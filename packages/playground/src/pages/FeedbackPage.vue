<template>
  <div class="demo-page">
    <h1 class="page-title">💬 Feedback 反馈组件</h1>

    <!-- Alert -->
    <demo-section title="Alert 提示" description="页面级通知，用于展示重要信息">
      <demo-block title="四种类型">
        <w-space direction="vertical" style="width:100%">
          <w-alert title="信息提示" description="这是一条普通信息消息" type="info" />
          <w-alert title="成功提示" description="操作成功完成！" type="success" />
          <w-alert title="警告提示" description="请注意此操作的潜在风险" type="warning" />
          <w-alert title="错误提示" description="操作失败，请重试" type="error" />
        </w-space>
      </demo-block>
      <demo-block title="可关闭"><w-alert title="可关闭提示" description="点击右侧 X 关闭此消息" type="info" closable @close="alert('已关闭')" /></demo-block>
      <demo-block title="居中显示"><w-alert title="居中提示" description="内容居中对齐" type="info" center /></demo-block>
      <demo-block title="仅标题"><w-alert title="这是一个没有描述的提示" type="success" /></demo-block>
    </demo-section>

    <!-- Dialog -->
    <demo-section title="Dialog 对话框" description="模态对话框，用于重要操作确认">
      <demo-block title="基础对话框">
        <w-button @click="dialogs.basic = true">打开对话框</w-button>
        <w-dialog v-model="dialogs.basic" title="系统提示"><p>您确定要执行此操作吗？</p><template #footer><w-button @click="dialogs.basic = false">取消</w-button><w-button type="primary" @click="dialogs.basic = false">确定</w-button></template></w-dialog>
      </demo-block>
      <demo-block title="自定义宽度">
        <w-button @click="dialogs.wide = true">宽对话框 (600px)</w-button>
        <w-dialog v-model="dialogs.wide" title="宽对话框" :width="600"><p>这是一个更宽的对话框，适合展示更多内容。</p><w-table :data="[{a:1,b:2},{a:3,b:4}]" :columns="[{prop:'a',label:'A'},{prop:'b',label:'B'}]" /></w-dialog>
      </demo-block>
      <demo-block title="点击遮罩关闭">
        <w-button @click="dialogs.mask = true">点击遮罩关闭</w-button>
        <w-dialog v-model="dialogs.mask" title="遮罩关闭" :close-on-click-modal="true"><p>点击对话框外部区域可关闭</p></w-dialog>
      </demo-block>
      <demo-block title="嵌套内容">
        <w-button @click="dialogs.nested = true">嵌套表单</w-button>
        <w-dialog v-model="dialogs.nested" title="编辑信息">
          <w-form><w-form-item label="名称"><w-input placeholder="请输入" /></w-form-item><w-form-item label="描述"><w-input placeholder="请输入" /></w-form-item></w-form>
          <template #footer><w-button @click="dialogs.nested = false">取消</w-button><w-button type="primary" @click="dialogs.nested = false">保存</w-button></template>
        </w-dialog>
      </demo-block>
    </demo-section>

    <!-- Drawer -->
    <demo-section title="Drawer 抽屉" description="侧边滑出面板">
      <demo-block title="右侧抽屉">
        <w-button @click="drawers.right = true">右侧滑出</w-button>
        <w-drawer v-model="drawers.right" title="设置"><p>抽屉内容区域</p><w-form><w-form-item label="主题"><w-select :options="[{label:'蓝色',value:'blue'}]" /></w-form-item><w-form-item label="语言"><w-select :options="[{label:'中文',value:'zh'}]" /></w-form-item></w-form></w-drawer>
      </demo-block>
      <demo-block title="底部抽屉">
        <w-button @click="drawers.bottom = true">底部滑出</w-button>
        <w-drawer v-model="drawers.bottom" title="详情" direction="bottom" size="200px"><p>从底部滑出的抽屉</p></w-drawer>
      </demo-block>
      <demo-block title="左侧抽屉">
        <w-button @click="drawers.left = true">左侧滑出</w-button>
        <w-drawer v-model="drawers.left" title="导航" direction="left" size="250px"><w-menu :items="[{label:'首页'},{label:'产品'},{label:'关于'}]" /></w-drawer>
      </demo-block>
      <demo-block title="不点击遮罩关闭">
        <w-button @click="drawers.stay = true">需手动关闭</w-button>
        <w-drawer v-model="drawers.stay" title="重要操作" :close-on-click-modal="false"><p>请点击右上角 X 或按钮关闭</p><template #footer><w-button @click="drawers.stay = false">关闭</w-button></template></w-drawer>
      </demo-block>
    </demo-section>

    <!-- Loading -->
    <demo-section title="Loading 加载" description="加载状态覆盖">
      <demo-block title="基础加载"><div style="position:relative;height:80px;border:1px solid #d4d0c8"><w-loading :visible="true" text="加载中..." /></div></demo-block>
      <demo-block title="无文字加载"><div style="position:relative;height:80px;border:1px solid #d4d0c8"><w-loading :visible="true" /></div></demo-block>
      <demo-block title="表格加载"><div style="position:relative;border:1px solid #d4d0c8"><w-table :data="[]" :columns="[{prop:'a',label:'A'}]" /><w-loading :visible="true" text="数据加载中..." /></div></demo-block>
      <demo-block title="内容区域加载"><div style="position:relative;height:120px;border:1px solid #d4d0c8;padding:12px"><p>底层内容</p><w-loading :visible="true" text="正在保存..." /></div></demo-block>
    </demo-section>

    <!-- Message -->
    <demo-section title="Message 消息提示" description="全局轻量消息通知，从顶部滑入">
      <demo-block title="四种类型">
        <w-space>
          <w-button @click="msgRef?.info('这是一条信息消息')">信息</w-button>
          <w-button @click="msgRef?.success('操作成功完成！')">成功</w-button>
          <w-button @click="msgRef?.warning('请注意此警告')">警告</w-button>
          <w-button @click="msgRef?.error('发生错误，请重试')">错误</w-button>
        </w-space>
      </demo-block>
      <demo-block title="长文本消息">
        <w-space>
          <w-button @click="msgRef?.info('这是一个比较长的消息文本，用于测试消息框的宽度自适应能力')">长文本</w-button>
          <w-button @click="msgRef?.success('数据保存成功！共保存了 128 条记录')">带数据</w-button>
        </w-space>
      </demo-block>
      <demo-block title="自定义时长">
        <w-space>
          <w-button @click="msgRef?.show('2秒后消失', 'info', 2000)">2秒消失</w-button>
          <w-button @click="msgRef?.show('5秒后消失', 'success', 5000)">5秒消失</w-button>
        </w-space>
      </demo-block>
      <!-- Message 组件实例 -->
      <w-message ref="msgRef" />
    </demo-section>

    <!-- Notification -->
    <demo-section title="Notification 通知" description="右上角通知提醒">
      <demo-block title="四种类型">
        <w-space>
          <w-button @click="notifyRef?.show({ message: '系统将于今晚维护', type: 'info' })">信息</w-button>
          <w-button @click="notifyRef?.show({ message: '文件上传成功', type: 'success' })">成功</w-button>
          <w-button @click="notifyRef?.show({ message: '磁盘空间不足', type: 'warning' })">警告</w-button>
          <w-button @click="notifyRef?.show({ message: '连接超时', type: 'error' })">错误</w-button>
        </w-space>
      </demo-block>
      <demo-block title="自定义标题">
        <w-space>
          <w-button @click="notifyRef?.show({ title: '新消息', message: '您有3条未读消息', type: 'info' })">新消息</w-button>
          <w-button @click="notifyRef?.show({ title: '订单通知', message: '您的订单已发货', type: 'success' })">订单通知</w-button>
        </w-space>
      </demo-block>
      <demo-block title="长内容通知">
        <w-button @click="notifyRef?.show({ title: '更新说明', message: '本次更新修复了多个已知问题，优化了性能表现，建议尽快升级到最新版本。', type: 'info' })">长内容</w-button>
      </demo-block>
      <!-- Notification 组件实例 -->
      <w-notification ref="notifyRef" />
    </demo-section>

    <!-- Popconfirm -->
    <demo-section title="Popconfirm 气泡确认框" description="二次确认，避免误操作">
      <demo-block title="基础确认"><w-popconfirm title="确认删除？" @confirm="alert('已删除')" @cancel="alert('已取消')"><w-button type="danger">删除</w-button></w-popconfirm></demo-block>
      <demo-block title="警告类型"><w-popconfirm title="此操作不可恢复！" type="warning" @confirm="alert('已确认')"><w-button type="warning">危险操作</w-button></w-popconfirm></demo-block>
      <demo-block title="配合图标"><w-popconfirm title="确认提交审核？" @confirm="alert('已提交')"><w-button type="primary">提交审核</w-button></w-popconfirm></demo-block>
      <demo-block title="纯文本触发"><w-popconfirm title="确认注销？" @confirm="alert('已注销')"><w-link type="danger">注销账号</w-link></w-popconfirm></demo-block>
    </demo-section>

    <!-- Popover -->
    <demo-section title="Popover 弹出框" description="悬浮内容面板，比 Tooltip 更丰富">
      <demo-block title="基础弹出框"><w-popover title="用户信息" content="这是用户详细信息面板"><w-button>查看用户</w-button></w-popover></demo-block>
      <demo-block title="hover 触发"><w-popover title="快捷操作" content="鼠标悬停触发" trigger="hover"><w-button>hover 触发</w-button></w-popover></demo-block>
      <demo-block title="自定义宽度"><w-popover title="宽面板" content="这是一个比较宽的内容面板" :width="300"><w-button>宽面板</w-button></w-popover></demo-block>
      <demo-block title="嵌套内容"><w-popover title="操作菜单"><template #content><w-space direction="vertical"><w-link>编辑</w-link><w-link type="danger">删除</w-link></w-space></template><w-button>操作</w-button></w-popover></demo-block>
    </demo-section>

    <!-- Tooltip -->
    <demo-section title="Tooltip 文字提示" description="简短的悬浮提示">
      <demo-block title="基础用法"><w-space><w-tooltip content="提示文字"><w-button>悬停查看</w-button></w-tooltip><w-tooltip content="删除此项目"><w-button icon="close" size="small" /></w-tooltip></w-space></demo-block>
      <demo-block title="长提示"><w-tooltip content="这是一个比较长的提示文字，用于展示多行内容的情况"><w-button>长提示</w-button></w-tooltip></demo-block>
      <demo-block title="配合图标"><w-space><w-tooltip content="搜索"><w-icon name="search" /></w-tooltip><w-tooltip content="用户信息"><w-icon name="user" /></w-tooltip></w-space></demo-block>
      <demo-block title="链接提示"><w-tooltip content="点击查看详情"><w-link>悬停链接</w-link></w-tooltip></demo-block>
    </demo-section>

    <!-- Message Box -->
    <demo-section title="Message Box 消息弹出框" description="确认对话框，比 Dialog 更轻量">
      <demo-block title="确认对话框"><w-button @click="msgBoxRef?.open({ message: '确认删除此文件？' })">确认框</w-button></demo-block>
      <demo-block title="带取消按钮"><w-button @click="msgBoxRef?.open({ message: '是否保存更改？', showCancelButton: true })">保存确认</w-button></demo-block>
      <demo-block title="自定义按钮文字"><w-button @click="msgBoxRef?.open({ message: '提交审核？', showCancelButton: true, confirmButtonText: '提交', cancelButtonText: '再想想' })">自定义文字</w-button></demo-block>
      <demo-block title="不同类型"><w-space><w-button @click="msgBoxRef?.open({ message: '操作成功！', type: 'success' })">成功</w-button><w-button @click="msgBoxRef?.open({ message: '发生错误！', type: 'error' })">错误</w-button><w-button @click="msgBoxRef?.open({ message: '请注意！', type: 'warning' })">警告</w-button></w-space></demo-block>
      <w-message-box ref="msgBoxRef" />
    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import DemoSection from '../components/DemoSection.vue'
import DemoBlock from '../components/DemoBlock.vue'

const dialogs = reactive({ basic: false, wide: false, mask: false, nested: false })
const drawers = reactive({ right: false, bottom: false, left: false, stay: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
