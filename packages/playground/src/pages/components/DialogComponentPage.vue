<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="模态对话框，用于重要操作确认" id="dialog" doc="dialog">

            <demo-block title="基础对话框" code="&lt;w-button @click=&quot;dialogs.basic = true&quot;&gt;打开对话框&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.basic&quot; title=&quot;系统提示&quot;&gt;&lt;p&gt;您确定要执行此操作吗？&lt;/p&gt;&lt;template #footer&gt;&lt;w-button @click=&quot;dialogs.basic = false&quot;&gt;取消&lt;/w-button&gt;&lt;w-button type=&quot;primary&quot; @click=&quot;dialogs.basic = false&quot;&gt;确定&lt;/w-button&gt;&lt;/template&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.basic = true">打开对话框</w-button>
              <w-dialog v-model="dialogs.basic" title="系统提示"><p>您确定要执行此操作吗？</p><template #footer><w-button @click="dialogs.basic = false">取消</w-button><w-button type="primary" @click="dialogs.basic = false">确定</w-button></template></w-dialog>
            </demo-block>
            <demo-block title="自定义宽度" code="&lt;w-button @click=&quot;dialogs.wide = true&quot;&gt;宽对话框 (600px)&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.wide&quot; title=&quot;宽对话框&quot; :width=&quot;600&quot;&gt;&lt;p&gt;这是一个更宽的对话框，适合展示更多内容。&lt;/p&gt;&lt;w-table :data=&quot;[{a:1,b:2},{a:3,b:4}]&quot; :columns=&quot;[{prop:'a',label:'A'},{prop:'b',label:'B'}]&quot; /&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.wide = true">宽对话框 (600px)</w-button>
              <w-dialog v-model="dialogs.wide" title="宽对话框" :width="600"><p>这是一个更宽的对话框，适合展示更多内容。</p><w-table :data="[{a:1,b:2},{a:3,b:4}]" :columns="[{prop:'a',label:'A'},{prop:'b',label:'B'}]" /></w-dialog>
            </demo-block>
            <demo-block title="点击遮罩关闭" code="&lt;w-button @click=&quot;dialogs.mask = true&quot;&gt;点击遮罩关闭&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.mask&quot; title=&quot;遮罩关闭&quot; :close-on-click-modal=&quot;true&quot;&gt;&lt;p&gt;点击对话框外部区域可关闭&lt;/p&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.mask = true">点击遮罩关闭</w-button>
              <w-dialog v-model="dialogs.mask" title="遮罩关闭" :close-on-click-modal="true"><p>点击对话框外部区域可关闭</p></w-dialog>
            </demo-block>
            <demo-block title="嵌套内容" code="&lt;w-button @click=&quot;dialogs.nested = true&quot;&gt;嵌套表单&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.nested&quot; title=&quot;编辑信息&quot;&gt;
        &lt;w-form&gt;&lt;w-form-item label=&quot;名称&quot;&gt;&lt;w-input placeholder=&quot;请输入&quot; /&gt;&lt;/w-form-item&gt;&lt;w-form-item label=&quot;描述&quot;&gt;&lt;w-input placeholder=&quot;请输入&quot; /&gt;&lt;/w-form-item&gt;&lt;/w-form&gt;
        &lt;template #footer&gt;&lt;w-button @click=&quot;dialogs.nested = false&quot;&gt;取消&lt;/w-button&gt;&lt;w-button type=&quot;primary&quot; @click=&quot;dialogs.nested = false&quot;&gt;保存&lt;/w-button&gt;&lt;/template&gt;
      &lt;/w-dialog&gt;">
              <w-button @click="dialogs.nested = true">嵌套表单</w-button>
              <w-dialog v-model="dialogs.nested" title="编辑信息">
                <w-form><w-form-item label="名称"><w-input placeholder="请输入" /></w-form-item><w-form-item label="描述"><w-input placeholder="请输入" /></w-form-item></w-form>
                <template #footer><w-button @click="dialogs.nested = false">取消</w-button><w-button type="primary" @click="dialogs.nested = false">保存</w-button></template>
              </w-dialog>
            </demo-block>
            <demo-block title="禁止拖动" code="&lt;w-button @click=&quot;dialogs.noDrag = true&quot;&gt;禁止拖动&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.noDrag&quot; title=&quot;不可拖动&quot; :draggable=&quot;false&quot;&gt;&lt;p&gt;该对话框头部不可拖动&lt;/p&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.noDrag = true">禁止拖动</w-button>
              <w-dialog v-model="dialogs.noDrag" title="不可拖动" :draggable="false"><p>该对话框头部不可拖动</p></w-dialog>
            </demo-block>
            <demo-block title="全屏对话框" code="&lt;w-button @click=&quot;dialogs.full = true&quot;&gt;全屏对话框&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.full&quot; title=&quot;全屏模式&quot;&gt;&lt;p&gt;点击标题栏图标可切换全屏/窗口模式。&lt;/p&gt;&lt;template #footer&gt;&lt;w-button @click=&quot;dialogs.full = false&quot;&gt;关闭&lt;/w-button&gt;&lt;/template&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.full = true">全屏对话框</w-button>
              <w-dialog v-model="dialogs.full" title="全屏模式"><p>点击标题栏图标可切换全屏/窗口模式。</p><template #footer><w-button @click="dialogs.full = false">关闭</w-button></template></w-dialog>
            </demo-block>
            <demo-block title="默认全屏" code="&lt;w-button @click=&quot;dialogs.fullDefault = true&quot;&gt;默认全屏&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.fullDefault&quot; title=&quot;默认全屏&quot; fullscreen&gt;&lt;p&gt;打开时直接进入全屏模式，仍可点击图标退出。&lt;/p&gt;&lt;template #footer&gt;&lt;w-button @click=&quot;dialogs.fullDefault = false&quot;&gt;关闭&lt;/w-button&gt;&lt;/template&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.fullDefault = true">默认全屏</w-button>
              <w-dialog v-model="dialogs.fullDefault" title="默认全屏" fullscreen><p>打开时直接进入全屏模式，仍可点击图标退出。</p><template #footer><w-button @click="dialogs.fullDefault = false">关闭</w-button></template></w-dialog>
            </demo-block>
            <demo-block title="自定义标题" code="&lt;w-button @click=&quot;dialogs.customHeader = true&quot;&gt;自定义标题&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.customHeader&quot;&gt;&lt;template #header&gt;&lt;w-icon name=&quot;warning&quot; size=&quot;small&quot; /&gt;&lt;span style=&quot;margin-left:6px&quot;&gt;警告提示&lt;/span&gt;&lt;/template&gt;&lt;p&gt;使用 header 插槽自定义标题栏内容。&lt;/p&gt;&lt;template #footer&gt;&lt;w-button @click=&quot;dialogs.customHeader = false&quot;&gt;知道了&lt;/w-button&gt;&lt;/template&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.customHeader = true">自定义标题</w-button>
              <w-dialog v-model="dialogs.customHeader"><template #header><w-icon name="warning" size="small" /><span style="margin-left:6px">警告提示</span></template><p>使用 header 插槽自定义标题栏内容。</p><template #footer><w-button @click="dialogs.customHeader = false">知道了</w-button></template></w-dialog>
            </demo-block>
            <demo-block title="自定义操作按钮" code="&lt;w-button @click=&quot;dialogs.customAction = true&quot;&gt;自定义操作&lt;/w-button&gt;
      &lt;w-dialog v-model=&quot;dialogs.customAction&quot; title=&quot;操作按钮&quot;&gt;&lt;template #action&gt;&lt;w-icon name=&quot;info&quot; size=&quot;small&quot; style=&quot;cursor:pointer&quot; @click=&quot;alert('更多信息')&quot; /&gt;&lt;/template&gt;&lt;p&gt;使用 action 插槽在全屏按钮左侧插入自定义图标或按钮。&lt;/p&gt;&lt;template #footer&gt;&lt;w-button @click=&quot;dialogs.customAction = false&quot;&gt;关闭&lt;/w-button&gt;&lt;/template&gt;&lt;/w-dialog&gt;">
              <w-button @click="dialogs.customAction = true">自定义操作</w-button>
              <w-dialog v-model="dialogs.customAction" title="操作按钮"><template #action><w-icon name="info" size="small" style="cursor:pointer" @click="alert('更多信息')" /></template><p>使用 action 插槽在全屏按钮左侧插入自定义图标或按钮。</p><template #footer><w-button @click="dialogs.customAction = false">关闭</w-button></template></w-dialog>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'

const dialogs = reactive({ basic: false, wide: false, mask: false, nested: false, noDrag: false, full: false, fullDefault: false, customHeader: false, customAction: false })
const drawers = reactive({ right: false, bottom: false, left: false, stay: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)

const title = 'Dialog 对话框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
