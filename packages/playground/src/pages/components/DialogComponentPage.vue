<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('模态对话框，用于重要操作确认')" id="dialog" doc="dialog">

            <demo-block :title="t('基础对话框')" :code="DialogCode1">
              <w-button @click="dialogs.basic = true">{{ t('打开对话框') }}</w-button>
              <w-dialog v-model="dialogs.basic" title="系统提示"><p>您确定要执行此操作吗？</p><template #footer><w-button @click="dialogs.basic = false">{{ t('取消') }}</w-button><w-button type="primary" @click="dialogs.basic = false">{{ t('确定') }}</w-button></template></w-dialog>
            </demo-block>
            <demo-block :title="t('自定义宽度')" :code="DialogCode2">
              <w-button @click="dialogs.wide = true">宽对话框 (600px)</w-button>
              <w-dialog v-model="dialogs.wide" title="宽对话框" :width="600"><p>这是一个更宽的对话框，适合展示更多内容。</p><w-table :data="[{a:1,b:2},{a:3,b:4}]" :columns="[{prop:'a',label:'A'},{prop:'b',label:'B'}]" /></w-dialog>
            </demo-block>
            <demo-block :title="t('点击遮罩关闭')" :code="DialogCode3">
              <w-button @click="dialogs.mask = true">点击遮罩关闭</w-button>
              <w-dialog v-model="dialogs.mask" title="遮罩关闭" :close-on-click-modal="true"><p>点击对话框外部区域可关闭</p></w-dialog>
            </demo-block>
            <demo-block :title="t('嵌套内容')" :code="DialogCode4">
              <w-button @click="dialogs.nested = true">嵌套表单</w-button>
              <w-dialog v-model="dialogs.nested" title="编辑信息">
                <w-form><w-form-item label="名称"><w-input placeholder="请输入" /></w-form-item><w-form-item label="描述"><w-input placeholder="请输入" /></w-form-item></w-form>
                <template #footer><w-button @click="dialogs.nested = false">取消</w-button><w-button type="primary" @click="dialogs.nested = false">保存</w-button></template>
              </w-dialog>
            </demo-block>
            <demo-block :title="t('禁止拖动')" :code="DialogCode5">
              <w-button @click="dialogs.noDrag = true">禁止拖动</w-button>
              <w-dialog v-model="dialogs.noDrag" title="不可拖动" :draggable="false"><p>该对话框头部不可拖动</p></w-dialog>
            </demo-block>
            <demo-block :title="t('全屏对话框')" :code="DialogCode6">
              <w-button @click="dialogs.full = true">全屏对话框</w-button>
              <w-dialog v-model="dialogs.full" title="全屏模式"><p>点击标题栏图标可切换全屏/窗口模式。</p><template #footer><w-button @click="dialogs.full = false">关闭</w-button></template></w-dialog>
            </demo-block>
            <demo-block :title="t('默认全屏')" :code="DialogCode7">
              <w-button @click="dialogs.fullDefault = true">默认全屏</w-button>
              <w-dialog v-model="dialogs.fullDefault" title="默认全屏" fullscreen><p>打开时直接进入全屏模式，仍可点击图标退出。</p><template #footer><w-button @click="dialogs.fullDefault = false">关闭</w-button></template></w-dialog>
            </demo-block>
            <demo-block :title="t('自定义标题')" :code="DialogCode8">
              <w-button @click="dialogs.customHeader = true">自定义标题</w-button>
              <w-dialog v-model="dialogs.customHeader"><template #header><w-icon name="warning" size="small" /><span style="margin-left:6px">警告提示</span></template><p>使用 header 插槽自定义标题栏内容。</p><template #footer><w-button @click="dialogs.customHeader = false">知道了</w-button></template></w-dialog>
            </demo-block>
            <demo-block :title="t('自定义操作按钮')" :code="DialogCode9">
              <w-button @click="dialogs.customAction = true">自定义操作</w-button>
              <w-dialog v-model="dialogs.customAction" title="操作按钮"><template #action><w-icon name="info" size="small" style="cursor:pointer" @click="alert('更多信息')" /></template><p>使用 action 插槽在全屏按钮左侧插入自定义图标或按钮。</p><template #footer><w-button @click="dialogs.customAction = false">关闭</w-button></template></w-dialog>
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

const dialogs = reactive({ basic: false, wide: false, mask: false, nested: false, noDrag: false, full: false, fullDefault: false, customHeader: false, customAction: false })
const drawers = reactive({ right: false, bottom: false, left: false, stay: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)

const title = t('Dialog 对话框')

const DialogCode1 = `<w-button @click="dialogs.basic = true">打开对话框</w-button>
      <w-dialog v-model="dialogs.basic" title="系统提示"><p>您确定要执行此操作吗？</p><template #footer><w-button @click="dialogs.basic = false">取消</w-button><w-button type="primary" @click="dialogs.basic = false">确定</w-button></template></w-dialog>`
const DialogCode2 = `<w-button @click="dialogs.wide = true">宽对话框 (600px)</w-button>
      <w-dialog v-model="dialogs.wide" title="宽对话框" :width="600"><p>这是一个更宽的对话框，适合展示更多内容。</p><w-table :data="[{a:1,b:2},{a:3,b:4}]" :columns="[{prop:'a',label:'A'},{prop:'b',label:'B'}]" /></w-dialog>`
const DialogCode3 = `<w-button @click="dialogs.mask = true">点击遮罩关闭</w-button>
      <w-dialog v-model="dialogs.mask" title="遮罩关闭" :close-on-click-modal="true"><p>点击对话框外部区域可关闭</p></w-dialog>`
const DialogCode4 = `<w-button @click="dialogs.nested = true">嵌套表单</w-button>
      <w-dialog v-model="dialogs.nested" title="编辑信息">
        <w-form><w-form-item label="名称"><w-input placeholder="请输入" /></w-form-item><w-form-item label="描述"><w-input placeholder="请输入" /></w-form-item></w-form>
        <template #footer><w-button @click="dialogs.nested = false">取消</w-button><w-button type="primary" @click="dialogs.nested = false">保存</w-button></template>
      </w-dialog>`
const DialogCode5 = `<w-button @click="dialogs.noDrag = true">禁止拖动</w-button>
      <w-dialog v-model="dialogs.noDrag" title="不可拖动" :draggable="false"><p>该对话框头部不可拖动</p></w-dialog>`
const DialogCode6 = `<w-button @click="dialogs.full = true">全屏对话框</w-button>
      <w-dialog v-model="dialogs.full" title="全屏模式"><p>点击标题栏图标可切换全屏/窗口模式。</p><template #footer><w-button @click="dialogs.full = false">关闭</w-button></template></w-dialog>`
const DialogCode7 = `<w-button @click="dialogs.fullDefault = true">默认全屏</w-button>
      <w-dialog v-model="dialogs.fullDefault" title="默认全屏" fullscreen><p>打开时直接进入全屏模式，仍可点击图标退出。</p><template #footer><w-button @click="dialogs.fullDefault = false">关闭</w-button></template></w-dialog>`
const DialogCode8 = `<w-button @click="dialogs.customHeader = true">自定义标题</w-button>
      <w-dialog v-model="dialogs.customHeader"><template #header><w-icon name="warning" size="small" /><span style="margin-left:6px">警告提示</span></template><p>使用 header 插槽自定义标题栏内容。</p><template #footer><w-button @click="dialogs.customHeader = false">知道了</w-button></template></w-dialog>`
const DialogCode9 = `<w-button @click="dialogs.customAction = true">自定义操作</w-button>
      <w-dialog v-model="dialogs.customAction" title="操作按钮"><template #action><w-icon name="info" size="small" style="cursor:pointer" @click="alert('更多信息')" /></template><p>使用 action 插槽在全屏按钮左侧插入自定义图标或按钮。</p><template #footer><w-button @click="dialogs.customAction = false">关闭</w-button></template></w-dialog>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
