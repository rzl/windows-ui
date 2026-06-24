# Dialog 对话框 - 使用说明

## 基础用法

```vue
<template>
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
</script>
```

## 禁止拖动

默认情况下对话框头部可拖动，可通过 `draggable` 属性禁用：

```vue
<template>
  <w-dialog v-model="visible" title="不可拖动" :draggable="false">
    <p>该对话框头部不可拖动</p>
  </w-dialog>
</template>
```

## 全屏对话框

通过 `fullscreen` 属性让对话框打开时直接进入全屏模式：

```vue
<template>
  <w-dialog v-model="visible" title="全屏模式" fullscreen>
    <p>全屏对话框内容区域自动撑开</p>
  </w-dialog>
</template>
```

对话框头部右侧提供全屏切换图标，用户可随时在窗口模式与全屏模式之间切换。设置 `fullscreen` 仅影响初始状态。

## 移动端适配

在屏幕宽度 ≤768px 的移动设备上，对话框打开时会自动切换为全屏模式，以充分利用可视区域并避免内容被挤压。移动端适配行为说明如下：

- **自动全屏**：视口宽度 ≤768px 时，弹窗打开自动将内部全屏状态置为 `true`，占据整个屏幕。
- **退出全屏**：标题栏右侧仍保留全屏切换图标，点击可将对话框从全屏切换回普通窗口模式。
- **拖拽支持**：在移动端退出全屏后，对话框恢复可拖拽，可通过标题栏拖动位置。
- **状态恢复**：当从移动端切回桌面端（视口宽度 >768px）时，对话框会自动恢复到之前的状态，不会影响桌面端原本的窗口/全屏设置。

> **使用注意事项**：移动端全屏为响应式行为，无需额外设置 `fullscreen` 属性；若已通过 `fullscreen` 强制指定初始全屏，则在桌面端仍按该属性生效。

## 自定义标题

通过 `header` 插槽自定义标题栏内容：

```vue
<template>
  <w-dialog v-model="visible">
    <template #header>
      <w-icon name="warning" size="small" />
      <span style="margin-left: 6px">警告提示</span>
    </template>
    <p>自定义标题内容</p>
  </w-dialog>
</template>
```

## 自定义操作按钮

通过 `action` 插槽在全屏按钮左侧插入自定义图标或按钮：

```vue
<template>
  <w-dialog v-model="visible" title="操作按钮">
    <template #action>
      <w-icon name="info" size="small" style="cursor: pointer" @click="handleInfo" />
    </template>
    <p>自定义操作按钮内容</p>
  </w-dialog>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | boolean | - |
| title | 标题 | string | 提示 |
| width | 宽度 | number | 420 |
| closeOnClickModal | 点击遮罩是否关闭 | boolean | true |
| draggable | 是否可拖拽 | boolean | true |
| fullscreen | 是否全屏 | boolean | false |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| close | 关闭时触发 | - |
| confirm | 确认时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| action | 操作区内容 |
| default | 默认内容 |
| footer | 底部内容 |
| header | 头部内容 |

## 主题定制

可通过 CSS 变量自定义主题色：

```css
:root {
  --w-color-primary: #245edb;
  --w-bg-color: #ece9d8;
  --w-text-color-primary: #000;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```
