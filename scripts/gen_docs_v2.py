#!/usr/bin/env python3
"""Regenerate usage.md with rich code examples for all 82 components."""

import os, re
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC = ROOT / "packages/windows-ui/src/components"
DOCS = ROOT / "docs"

EXAMPLES = {
    "button": """<template>
  <w-space wrap>
    <w-button>默认按钮</w-button>
    <w-button type="primary">主要按钮</w-button>
    <w-button type="success">成功按钮</w-button>
    <w-button type="warning">警告按钮</w-button>
    <w-button type="danger">危险按钮</w-button>
    <w-button type="info">信息按钮</w-button>
    <w-button plain>朴素按钮</w-button>
    <w-button round>圆角按钮</w-button>
    <w-button icon="search" />
    <w-button type="primary" disabled>禁用状态</w-button>
  </w-space>
</template>

<script setup>
import { WButton, WSpace } from '@windows-ui/core'
</script>""",
    "input": """<template>
  <w-space direction="vertical">
    <w-input v-model="value" placeholder="请输入内容" />
    <w-input v-model="value" clearable placeholder="可清空" />
    <w-input v-model="value" prefix-icon="search" placeholder="带前缀图标" />
    <w-input v-model="value" suffix-icon="calendar" placeholder="带后缀图标" />
    <w-input v-model="value" disabled placeholder="禁用状态" />
    <w-input v-model="value" size="small" placeholder="小尺寸" />
    <w-input v-model="value" size="large" placeholder="大尺寸" />
  </w-space>
</template>

<script setup>
import { ref } from 'vue'
import { WInput, WSpace } from '@windows-ui/core'
const value = ref('')
</script>""",
    "input-number": """<template>
  <w-input-number v-model="num" :min="1" :max="10" />
</template>

<script setup>
import { ref } from 'vue'
import { WInputNumber } from '@windows-ui/core'
const num = ref(1)
</script>""",
    "input-otp": """<template>
  <w-input-otp v-model="otp" :length="6" />
</template>

<script setup>
import { ref } from 'vue'
import { WInputOtp } from '@windows-ui/core'
const otp = ref('')
</script>""",
    "input-tag": """<template>
  <w-input-tag v-model="tags" placeholder="输入后按回车添加标签" />
</template>

<script setup>
import { ref } from 'vue'
import { WInputTag } from '@windows-ui/core'
const tags = ref(['标签一', '标签二'])
</script>""",
    "select": """<template>
  <w-select v-model="value" placeholder="请选择">
    <w-option label="选项一" value="1" />
    <w-option label="选项二" value="2" />
    <w-option label="选项三" value="3" />
  </w-select>
</template>

<script setup>
import { ref } from 'vue'
import { WSelect, WOption } from '@windows-ui/core'
const value = ref('')
</script>""",
    "radio": """<template>
  <w-radio-group v-model="radio">
    <w-radio label="1">选项一</w-radio>
    <w-radio label="2">选项二</w-radio>
    <w-radio label="3">选项三</w-radio>
  </w-radio-group>
</template>

<script setup>
import { ref } from 'vue'
import { WRadioGroup, WRadio } from '@windows-ui/core'
const radio = ref('1')
</script>""",
    "checkbox": """<template>
  <w-checkbox-group v-model="checked">
    <w-checkbox label="选项一" />
    <w-checkbox label="选项二" />
    <w-checkbox label="选项三" />
  </w-checkbox-group>
</template>

<script setup>
import { ref } from 'vue'
import { WCheckboxGroup, WCheckbox } from '@windows-ui/core'
const checked = ref(['选项一'])
</script>""",
    "switch": """<template>
  <w-space>
    <w-switch v-model="value" />
    <w-switch v-model="value" active-text="开" inactive-text="关" />
  </w-space>
</template>

<script setup>
import { ref } from 'vue'
import { WSwitch, WSpace } from '@windows-ui/core'
const value = ref(true)
</script>""",
    "slider": """<template>
  <w-slider v-model="value" />
  <w-slider v-model="valueRange" range />
</template>

<script setup>
import { ref } from 'vue'
import { WSlider } from '@windows-ui/core'
const value = ref(50)
const valueRange = ref([20, 80])
</script>""",
    "rate": """<template>
  <w-rate v-model="value" />
  <w-rate v-model="value" show-text />
</template>

<script setup>
import { ref } from 'vue'
import { WRate } from '@windows-ui/core'
const value = ref(3)
</script>""",
    "tag": """<template>
  <w-space>
    <w-tag>默认标签</w-tag>
    <w-tag type="success">成功</w-tag>
    <w-tag type="warning">警告</w-tag>
    <w-tag type="danger">危险</w-tag>
    <w-tag type="info">信息</w-tag>
    <w-tag closable @close="handleClose">可关闭</w-tag>
  </w-space>
</template>

<script setup>
import { WTag, WSpace } from '@windows-ui/core'
const handleClose = () => console.log('关闭标签')
</script>""",
    "badge": """<template>
  <w-badge :value="12" class="item">
    <w-button>评论</w-button>
  </w-badge>
  <w-badge :value="3" class="item" type="primary">
    <w-button>回复</w-button>
  </w-badge>
  <w-badge is-dot class="item">
    <w-button>消息</w-button>
  </w-badge>
</template>

<script setup>
import { WBadge, WButton } from '@windows-ui/core'
</script>

<style scoped>
.item { margin-right: 20px; }
</style>""",
    "alert": """<template>
  <w-alert title="成功提示" description="这是一条成功的提示信息" type="success" show-icon />
  <w-alert title="警告提示" description="这是一条警告的提示信息" type="warning" show-icon closable />
  <w-alert title="错误提示" type="error" center />
</template>

<script setup>
import { WAlert } from '@windows-ui/core'
</script>""",
    "dialog": """<template>
  <w-button @click="visible = true">打开对话框</w-button>
  <w-dialog v-model="visible" title="提示" width="400px">
    <span>这是一段信息</span>
    <template #footer>
      <w-button @click="visible = false">取消</w-button>
      <w-button type="primary" @click="visible = false">确定</w-button>
    </template>
  </w-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { WDialog, WButton } from '@windows-ui/core'
const visible = ref(false)
</script>""",
    "drawer": """<template>
  <w-button @click="visible = true">打开抽屉</w-button>
  <w-drawer v-model="visible" title="标题" direction="rtl">
    <p>抽屉内容区域</p>
  </w-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { WDrawer, WButton } from '@windows-ui/core'
const visible = ref(false)
</script>""",
    "popover": """<template>
  <w-popover title="标题" content="这是一段内容" placement="top">
    <w-button>hover 激活</w-button>
  </w-popover>
</template>

<script setup>
import { WPopover, WButton } from '@windows-ui/core'
</script>""",
    "popconfirm": """<template>
  <w-popconfirm title="确定删除吗？" @confirm="handleConfirm">
    <w-button>删除</w-button>
  </w-popconfirm>
</template>

<script setup>
import { WPopconfirm, WButton } from '@windows-ui/core'
const handleConfirm = () => console.log('确认删除')
</script>""",
    "tooltip": """<template>
  <w-tooltip content="Top center" placement="top">
    <w-button>上方提示</w-button>
  </w-tooltip>
</template>

<script setup>
import { WTooltip, WButton } from '@windows-ui/core'
</script>""",
    "dropdown": """<template>
  <w-dropdown @command="handleCommand">
    <w-button>下拉菜单 <w-icon name="arrowDown" /></w-button>
    <template #dropdown>
      <w-dropdown-menu>
        <w-dropdown-item command="a">黄金糕</w-dropdown-item>
        <w-dropdown-item command="b">狮子头</w-dropdown-item>
        <w-dropdown-item command="c">螺蛳粉</w-dropdown-item>
      </w-dropdown-menu>
    </template>
  </w-dropdown>
</template>

<script setup>
import { WDropdown, WDropdownMenu, WDropdownItem, WButton, WIcon } from '@windows-ui/core'
const handleCommand = (cmd) => console.log(cmd)
</script>""",
    "menu": """<template>
  <w-menu default-active="1">
    <w-menu-item index="1">处理中心</w-menu-item>
    <w-sub-menu index="2" title="我的工作台">
      <w-menu-item index="2-1">选项一</w-menu-item>
      <w-menu-item index="2-2">选项二</w-menu-item>
    </w-sub-menu>
    <w-menu-item index="3">消息中心</w-menu-item>
  </w-menu>
</template>

<script setup>
import { WMenu, WMenuItem, WSubMenu } from '@windows-ui/core'
</script>""",
    "tabs": """<template>
  <w-tabs v-model="activeName">
    <w-tab-pane label="用户管理" name="first">用户管理内容</w-tab-pane>
    <w-tab-pane label="配置管理" name="second">配置管理内容</w-tab-pane>
    <w-tab-pane label="角色管理" name="third">角色管理内容</w-tab-pane>
  </w-tabs>
</template>

<script setup>
import { ref } from 'vue'
import { WTabs, WTabPane } from '@windows-ui/core'
const activeName = ref('first')
</script>""",
    "breadcrumb": """<template>
  <w-breadcrumb separator="/">
    <w-breadcrumb-item :to="{ path: '/' }">首页</w-breadcrumb-item>
    <w-breadcrumb-item>活动管理</w-breadcrumb-item>
    <w-breadcrumb-item>活动列表</w-breadcrumb-item>
  </w-breadcrumb>
</template>

<script setup>
import { WBreadcrumb, WBreadcrumbItem } from '@windows-ui/core'
</script>""",
    "steps": """<template>
  <w-steps :active="1">
    <w-step title="步骤 1" description="描述信息" />
    <w-step title="步骤 2" description="描述信息" />
    <w-step title="步骤 3" description="描述信息" />
  </w-steps>
</template>

<script setup>
import { WSteps, WStep } from '@windows-ui/core'
</script>""",
    "pagination": """<template>
  <w-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="100"
    layout="total, prev, pager, next"
  />
</template>

<script setup>
import { ref } from 'vue'
import { WPagination } from '@windows-ui/core'
const currentPage = ref(1)
const pageSize = ref(10)
</script>""",
    "avatar": """<template>
  <w-space>
    <w-avatar src="https://example.com/avatar.jpg" />
    <w-avatar icon="user" />
    <w-avatar>User</w-avatar>
    <w-avatar shape="square" icon="user" />
    <w-avatar :size="40" bg-color="#245edb">U</w-avatar>
  </w-space>
</template>

<script setup>
import { WAvatar, WSpace } from '@windows-ui/core'
</script>""",
    "progress": """<template>
  <w-progress :percentage="50" />
  <w-progress :percentage="100" status="success" />
  <w-progress :percentage="80" status="warning" />
  <w-progress :percentage="30" status="exception" />
</template>

<script setup>
import { WProgress } from '@windows-ui/core'
</script>""",
    "table": """<template>
  <w-table :data="tableData" :columns="columns">
    <template #name="{ row }">
      <w-tag>{{ row.name }}</w-tag>
    </template>
  </w-table>
</template>

<script setup>
import { WTable, WTag } from '@windows-ui/core'
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'date', label: '日期' },
  { prop: 'address', label: '地址' }
]
const tableData = [
  { name: '张三', date: '2024-01-01', address: '北京市' },
  { name: '李四', date: '2024-01-02', address: '上海市' }
]
</script>""",
    "tree": """<template>
  <w-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
</template>

<script setup>
import { WTree } from '@windows-ui/core'
const defaultProps = { children: 'children', label: 'label' }
const data = [
  { label: '一级 1', children: [{ label: '二级 1-1' }] },
  { label: '一级 2', children: [{ label: '二级 2-1' }, { label: '二级 2-2' }] }
]
const handleNodeClick = (data) => console.log(data)
</script>""",
    "transfer": """<template>
  <w-transfer v-model="value" :data="data" />
</template>

<script setup>
import { ref } from 'vue'
import { WTransfer } from '@windows-ui/core'
const data = Array.from({ length: 15 }, (_, i) => ({ key: i + 1, label: `备选项 ${i + 1}` }))
const value = ref([1, 4])
</script>""",
    "form": """<template>
  <w-form :model="form" :rules="rules" ref="formRef">
    <w-form-item label="用户名" prop="name">
      <w-input v-model="form.name" />
    </w-form-item>
    <w-form-item label="邮箱" prop="email">
      <w-input v-model="form.email" />
    </w-form-item>
    <w-form-item>
      <w-button type="primary" @click="submitForm">提交</w-button>
      <w-button @click="resetForm">重置</w-button>
    </w-form-item>
  </w-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { WForm, WFormItem, WInput, WButton } from '@windows-ui/core'
const formRef = ref()
const form = reactive({ name: '', email: '' })
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}
const submitForm = () => formRef.value.validate()
const resetForm = () => formRef.value.resetFields()
</script>""",
    "calendar": """<template>
  <w-calendar v-model="value" />
</template>

<script setup>
import { ref } from 'vue'
import { WCalendar } from '@windows-ui/core'
const value = ref(new Date())
</script>""",
    "card": """<template>
  <w-card style="width: 400px">
    <template #header>
      <span>卡片名称</span>
      <w-button type="text">操作按钮</w-button>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ '列表内容 ' + o }}</div>
  </w-card>
</template>

<script setup>
import { WCard, WButton } from '@windows-ui/core'
</script>

<style scoped>
.text { font-size: 14px; }
.item { margin-bottom: 18px; }
</style>""",
    "carousel": """<template>
  <w-carousel height="200px">
    <w-carousel-item v-for="item in 4" :key="item">
      <div class="carousel-item">{{ item }}</div>
    </w-carousel-item>
  </w-carousel>
</template>

<script setup>
import { WCarousel, WCarouselItem } from '@windows-ui/core'
</script>

<style scoped>
.carousel-item {
  height: 200px;
  background-color: #d3dce6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>""",
    "collapse": """<template>
  <w-collapse v-model="activeNames">
    <w-collapse-item title="一致性 Consistency" name="1">
      <div>与现实生活一致：与现实生活的流程、逻辑保持一致。</div>
    </w-collapse-item>
    <w-collapse-item title="反馈 Feedback" name="2">
      <div>控制反馈：通过界面样式和交互动效让用户感知操作。</div>
    </w-collapse-item>
  </w-collapse>
</template>

<script setup>
import { ref } from 'vue'
import { WCollapse, WCollapseItem } from '@windows-ui/core'
const activeNames = ref(['1'])
</script>""",
    "timeline": """<template>
  <w-timeline>
    <w-timeline-item timestamp="2024-01-01" placement="top">
      <w-card><h4>更新 Github 模板</h4></w-card>
    </w-timeline-item>
    <w-timeline-item timestamp="2024-01-02">
      <w-card><h4>更新组件库</h4></w-card>
    </w-timeline-item>
  </w-timeline>
</template>

<script setup>
import { WTimeline, WTimelineItem, WCard } from '@windows-ui/core'
</script>""",
    "divider": """<template>
  <span>雨纷纷</span>
  <w-divider direction="vertical" />
  <span>旧故里</span>
  <w-divider direction="vertical" />
  <span>草木深</span>
  <w-divider content-position="left">左侧文本</w-divider>
  <w-divider content-position="right">右侧文本</w-divider>
</template>

<script setup>
import { WDivider } from '@windows-ui/core'
</script>""",
    "space": """<template>
  <w-space wrap>
    <w-button v-for="i in 10" :key="i">按钮{{ i }}</w-button>
  </w-space>
</template>

<script setup>
import { WSpace, WButton } from '@windows-ui/core'
</script>""",
    "container": """<template>
  <w-container>
    <w-header>Header</w-header>
    <w-main>Main</w-main>
    <w-footer>Footer</w-footer>
  </w-container>
</template>

<script setup>
import { WContainer, WHeader, WMain, WFooter } from '@windows-ui/core'
</script>

<style scoped>
.w-header, .w-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.w-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>""",
    "layout": """<template>
  <w-row :gutter="20">
    <w-col :span="6"><div class="grid-content">1</div></w-col>
    <w-col :span="6"><div class="grid-content">2</div></w-col>
    <w-col :span="6"><div class="grid-content">3</div></w-col>
    <w-col :span="6"><div class="grid-content">4</div></w-col>
  </w-row>
</template>

<script setup>
import { WRow, WCol } from '@windows-ui/core'
</script>

<style scoped>
.grid-content {
  background: #d3dce6;
  border-radius: 4px;
  min-height: 36px;
  text-align: center;
  line-height: 36px;
}
</style>""",
    "link": """<template>
  <w-space>
    <w-link href="https://example.com" target="_blank">默认链接</w-link>
    <w-link type="primary">主要链接</w-link>
    <w-link type="success">成功链接</w-link>
    <w-link type="warning">警告链接</w-link>
    <w-link type="danger">危险链接</w-link>
    <w-link :underline="false">无下划线</w-link>
    <w-link disabled>禁用状态</w-link>
  </w-space>
</template>

<script setup>
import { WLink, WSpace } from '@windows-ui/core'
</script>""",
    "text": """<template>
  <w-space direction="vertical">
    <w-text>默认文本</w-text>
    <w-text type="primary">主要文本</w-text>
    <w-text type="success">成功文本</w-text>
    <w-text type="warning">警告文本</w-text>
    <w-text type="danger">危险文本</w-text>
    <w-text size="large">大号文本</w-text>
    <w-text size="small">小号文本</w-text>
    <w-text truncated>这是一段会被截断的文本内容...</w-text>
    <w-text tag="b">加粗文本</w-text>
  </w-space>
</template>

<script setup>
import { WText, WSpace } from '@windows-ui/core'
</script>""",
    "typography": """<template>
  <w-typography>
    <h1>标题一</h1>
    <h2>标题二</h2>
    <p>这是一段普通文本，包含 <strong>加粗</strong> 和 <em>斜体</em> 样式。</p>
    <p>代码片段：<code>const a = 1</code></p>
  </w-typography>
</template>

<script setup>
import { WTypography } from '@windows-ui/core'
</script>""",
    "empty": """<template>
  <w-empty description="暂无数据" />
</template>

<script setup>
import { WEmpty } from '@windows-ui/core'
</script>""",
    "result": """<template>
  <w-result icon="success" title="成功提示" sub-title="请根据提示进行操作">
    <template #extra>
      <w-button type="primary">返回</w-button>
    </template>
  </w-result>
</template>

<script setup>
import { WResult, WButton } from '@windows-ui/core'
</script>""",
    "skeleton": """<template>
  <w-skeleton :rows="5" animated />
</template>

<script setup>
import { WSkeleton } from '@windows-ui/core'
</script>""",
    "statistic": """<template>
  <w-row :gutter="20">
    <w-col :span="8">
      <w-statistic title="DAU" :value="268500" />
    </w-col>
    <w-col :span="8">
      <w-statistic title="订单" :value="128" />
    </w-col>
  </w-row>
</template>

<script setup>
import { WStatistic, WRow, WCol } from '@windows-ui/core'
</script>""",
    "descriptions": """<template>
  <w-descriptions title="用户信息" border>
    <w-descriptions-item label="用户名">kooriookami</w-descriptions-item>
    <w-descriptions-item label="手机号">18100000000</w-descriptions-item>
    <w-descriptions-item label="居住地">苏州市</w-descriptions-item>
  </w-descriptions>
</template>

<script setup>
import { WDescriptions, WDescriptionsItem } from '@windows-ui/core'
</script>""",
    "image": """<template>
  <w-image
    style="width: 100px; height: 100px"
    src="https://example.com/image.jpg"
    :preview-src-list="['https://example.com/image.jpg']"
  />
</template>

<script setup>
import { WImage } from '@windows-ui/core'
</script>""",
    "icon": """<template>
  <w-space>
    <w-icon name="search" />
    <w-icon name="edit" />
    <w-icon name="delete" />
    <w-icon name="share" />
    <w-icon name="arrow-up" />
    <w-icon name="arrow-down" />
    <w-icon name="close" />
    <w-icon name="check" />
    <w-icon name="info" />
    <w-icon name="warning" />
  </w-space>
</template>

<script setup>
import { WIcon, WSpace } from '@windows-ui/core'
</script>""",
    "loading": """<template>
  <w-button @click="handleClick">显示加载中</w-button>
  <div v-loading="loading" style="height: 100px; margin-top: 20px;">
    加载区域
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { WButton } from '@windows-ui/core'
const loading = ref(false)
const handleClick = () => {
  loading.value = true
  setTimeout(() => loading.value = false, 2000)
}
</script>""",
    "scrollbar": """<template>
  <w-scrollbar height="200px">
    <p v-for="item in 20" :key="item">{{ item }}</p>
  </w-scrollbar>
</template>

<script setup>
import { WScrollbar } from '@windows-ui/core'
</script>""",
    "splitter": """<template>
  <w-splitter style="height: 200px">
    <w-splitter-pane>左侧面板</w-splitter-pane>
    <w-splitter-pane>右侧面板</w-splitter-pane>
  </w-splitter>
</template>

<script setup>
import { WSplitter, WSplitterPane } from '@windows-ui/core'
</script>""",
    "affix": """<template>
  <w-affix :offset="80">
    <w-button type="primary">固定在顶部 80px</w-button>
  </w-affix>
</template>

<script setup>
import { WAffix, WButton } from '@windows-ui/core'
</script>""",
    "anchor": """<template>
  <w-anchor :links="links" />
</template>

<script setup>
import { WAnchor } from '@windows-ui/core'
const links = [
  { href: '#basic', title: '基础用法' },
  { href: '#api', title: 'API' },
  { href: '#theme', title: '主题定制' }
]
</script>""",
    "autocomplete": """<template>
  <w-autocomplete
    v-model="state"
    :options="restaurants"
    placeholder="请输入内容"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import { WAutocomplete } from '@windows-ui/core'
const state = ref('')
const restaurants = [
  { value: '三全鲜食（北新泾店）', label: '三全鲜食（北新泾店）' },
  { value: 'Hot honey 首尔炸鸡（仙霞路）', label: 'Hot honey 首尔炸鸡（仙霞路）' }
]
const handleSelect = (item) => console.log(item)
</script>""",
    "backtop": """<template>
  <div style="height: 2000px;">
    <p>向下滚动查看 Backtop 组件</p>
  </div>
  <w-backtop />
</template>

<script setup>
import { WBacktop } from '@windows-ui/core'
</script>""",
    "border": """<template>
  <w-border>
    <div class="content">带边框的内容区域</div>
  </w-border>
</template>

<script setup>
import { WBorder } from '@windows-ui/core'
</script>

<style scoped>
.content { padding: 20px; }
</style>""",
    "cascader": """<template>
  <w-cascader v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
import { WCascader } from '@windows-ui/core'
const value = ref([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      { value: 'disciplines', label: 'Disciplines' },
      { value: 'navigation', label: 'Navigation' }
    ]
  }
]
</script>""",
    "color": """<template>
  <w-color @select="handleSelect" />
</template>

<script setup>
import { WColor } from '@windows-ui/core'
const handleSelect = (color) => console.log(color)
</script>""",
    "color-picker": """<template>
  <w-color-picker v-model="color" />
</template>

<script setup>
import { ref } from 'vue'
import { WColorPicker } from '@windows-ui/core'
const color = ref('#409EFF')
</script>""",
    "color-picker-panel": """<template>
  <w-color-picker-panel @change="handleChange" />
</template>

<script setup>
import { WColorPickerPanel } from '@windows-ui/core'
const handleChange = (color) => console.log(color)
</script>""",
    "config-provider": """<template>
  <w-config-provider :locale="locale" :prefix="'w'">
    <w-button>默认按钮</w-button>
  </w-config-provider>
</template>

<script setup>
import { WConfigProvider, WButton } from '@windows-ui/core'
const locale = {
  name: 'zh-cn',
  button: { confirm: '确定', cancel: '取消' }
}
</script>""",
    "date-picker": """<template>
  <w-date-picker v-model="value" placeholder="选择日期" />
  <w-date-picker v-model="valueRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
</template>

<script setup>
import { ref } from 'vue'
import { WDatePicker } from '@windows-ui/core'
const value = ref('')
const valueRange = ref('')
</script>""",
    "date-picker-panel": """<template>
  <w-date-picker-panel v-model="value" />
</template>

<script setup>
import { ref } from 'vue'
import { WDatePickerPanel } from '@windows-ui/core'
const value = ref(new Date())
</script>""",
    "date-time-picker": """<template>
  <w-date-time-picker v-model="value" placeholder="选择日期时间" />
</template>

<script setup>
import { ref } from 'vue'
import { WDateTimePicker } from '@windows-ui/core'
const value = ref('')
</script>""",
    "time-picker": """<template>
  <w-time-picker v-model="value" placeholder="选择时间" />
</template>

<script setup>
import { ref } from 'vue'
import { WTimePicker } from '@windows-ui/core'
const value = ref('')
</script>""",
    "time-select": """<template>
  <w-time-select v-model="value" :start="'08:30'" :step="'00:15'" :end="'18:30'" placeholder="选择时间" />
</template>

<script setup>
import { ref } from 'vue'
import { WTimeSelect } from '@windows-ui/core'
const value = ref('')
</script>""",
    "infinite-scroll": """<template>
  <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
    <li v-for="i in count" :key="i" class="list-item">{{ i }}</li>
  </ul>
  <p v-if="loading">加载中...</p>
  <p v-if="noMore">没有更多了</p>
</template>

<script setup>
import { ref, computed } from 'vue'
const count = ref(10)
const loading = ref(false)
const noMore = computed(() => count.value >= 20)
const disabled = computed(() => loading.value || noMore.value)
const load = () => {
  loading.value = true
  setTimeout(() => {
    count.value += 2
    loading.value = false
  }, 2000)
}
</script>

<style scoped>
.list { height: 300px; overflow: auto; padding: 0; margin: 0; list-style: none; }
.list-item { display: flex; align-items: center; justify-content: center; height: 50px; border-bottom: 1px solid #e8e8e8; }
</style>""",
    "mention": """<template>
  <w-mention v-model="text" :options="options" placeholder="输入 @ 提及用户" />
</template>

<script setup>
import { ref } from 'vue'
import { WMention } from '@windows-ui/core'
const text = ref('')
const options = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' }
]
</script>""",
    "page-header": """<template>
  <w-page-header title="详情页面" content="详情内容" @back="goBack" />
</template>

<script setup>
import { WPageHeader } from '@windows-ui/core'
const goBack = () => console.log('返回上一页')
</script>""",
    "segmented": """<template>
  <w-segmented v-model="value" :options="options" />
</template>

<script setup>
import { ref } from 'vue'
import { WSegmented } from '@windows-ui/core'
const value = ref('Mon')
const options = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
</script>""",
    "tour": """<template>
  <w-button ref="ref1">上传文件</w-button>
  <w-button ref="ref2">保存</w-button>
  <w-tour :steps="steps" />
</template>

<script setup>
import { ref } from 'vue'
import { WTour, WButton } from '@windows-ui/core'
const ref1 = ref()
const ref2 = ref()
const steps = [
  { title: '上传文件', description: '将文件上传到服务器', target: () => ref1.value?.$el },
  { title: '保存', description: '保存当前更改', target: () => ref2.value?.$el }
]
</script>""",
    "tree-select": """<template>
  <w-tree-select v-model="value" :data="data" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
import { WTreeSelect } from '@windows-ui/core'
const value = ref('')
const data = [
  { label: '一级 1', children: [{ label: '二级 1-1' }] },
  { label: '一级 2', children: [{ label: '二级 2-1' }] }
]
</script>""",
    "upload": """<template>
  <w-upload action="https://example.com/upload" :on-success="handleSuccess">
    <w-button type="primary">点击上传</w-button>
  </w-upload>
</template>

<script setup>
import { WUpload, WButton } from '@windows-ui/core'
const handleSuccess = (res, file) => console.log(file.name + ' 上传成功')
</script>""",
    "virtualized-select": """<template>
  <w-virtualized-select v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
import { WVirtualizedSelect } from '@windows-ui/core'
const value = ref('')
const options = Array.from({ length: 1000 }, (_, i) => ({ label: `选项 ${i + 1}`, value: String(i + 1) }))
</script>""",
    "virtualized-table": """<template>
  <w-virtualized-table :data="data" :columns="columns" :height="400" />
</template>

<script setup>
import { WVirtualizedTable } from '@windows-ui/core'
const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '名称' },
  { prop: 'date', label: '日期' }
]
const data = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  date: '2024-01-01'
}))
</script>""",
    "virtualized-tree": """<template>
  <w-virtualized-tree :data="data" :props="defaultProps" :height="400" />
</template>

<script setup>
import { WVirtualizedTree } from '@windows-ui/core'
const defaultProps = { children: 'children', label: 'label' }
const data = Array.from({ length: 100 }, (_, i) => ({
  label: `节点 ${i + 1}`,
  children: Array.from({ length: 10 }, (_, j) => ({ label: `子节点 ${i + 1}-${j + 1}` }))
}))
</script>""",
    "watermark": """<template>
  <w-watermark content="Windows UI" :font="{ color: 'rgba(0,0,0,0.1)' }">
    <div style="height: 300px;">内容区域</div>
  </w-watermark>
</template>

<script setup>
import { WWatermark } from '@windows-ui/core'
</script>""",
    "message": """<template>
  <w-space>
    <w-button @click="$message.info('这是一条消息')">消息</w-button>
    <w-button @click="$message.success('成功消息')">成功</w-button>
    <w-button @click="$message.warning('警告消息')">警告</w-button>
    <w-button @click="$message.error('错误消息')">错误</w-button>
  </w-space>
</template>

<script setup>
import { WButton, WSpace } from '@windows-ui/core'
</script>""",
    "message-box": """<template>
  <w-space>
    <w-button @click="openMsgBox">打开消息框</w-button>
    <w-button @click="openConfirm">确认框</w-button>
  </w-space>
</template>

<script setup>
import { WButton, WSpace } from '@windows-ui/core'
const openMsgBox = () => {
  // 使用全局方法或组件方式
}
const openConfirm = () => {
  // 使用全局方法或组件方式
}
</script>""",
    "notification": """<template>
  <w-space>
    <w-button @click="notify">通知</w-button>
    <w-button @click="notifySuccess">成功通知</w-button>
  </w-space>
</template>

<script setup>
import { WButton, WSpace } from '@windows-ui/core'
const notify = () => {
  // 使用全局方法调用
}
const notifySuccess = () => {
  // 使用全局方法调用
}
</script>""",
}
