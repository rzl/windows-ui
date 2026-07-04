# WPageDesigner 页面设计器

低代码自定义页面设计器，提供组件库、画布与属性面板，支持拖拽/触屏添加组件、嵌套容器、属性编辑与实时预览。

## 基础用法

```vue
<script setup lang="ts">
import { WPageDesigner } from '@windows-ui/core'
import * as pageApi from '@/api/page'

async function loadPage(code: string) {
  return pageApi.getPage(code)
}

async function savePage(data: any) {
  await pageApi.savePage(data)
}
</script>

<template>
  <w-page-designer
    code="sales_dashboard"
    :load-page="loadPage"
    :save-page="savePage"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | `string` | — | 页面编码，与 `loadPage` 配合使用 |
| page | `any` | — | 直接传入页面元数据，优先级高于 `code` + `loadPage` |
| config | `PageConfig` | — | 直接传入页面配置，优先级高于加载结果 |
| loadPage | `(code: string) => Promise<any>` | — | 加载页面数据回调 |
| savePage | `(data: any) => Promise<any>` | — | 保存页面数据回调 |
| isMobile | `boolean` | `false` | 是否启用移动端面板切换布局 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| save | `data: any` | 点击保存后触发 |
| back | — | 点击返回后触发 |
| preview | — | 点击预览后触发 |

## 内置组件

- 布局：容器、卡片、栅格、标签页
- 展示：文本、图片、分隔线、统计卡片、图表、公告、表格、列表
- 数据：数据模型、仪表盘、报表
- 表单：输入框、选择器、单选框、多选框、开关、日期选择
- 交互：按钮、链接

## 表单数据绑定

表单组件（输入框、选择器等）支持在属性面板中配置 `绑定字段`，渲染时会自动读写页面级的 `formData`。例如：

```json
{
  "type": "input",
  "props": { "label": "用户名", "field": "username", "modelValue": "" }
}
```

页面保存时，`config.formData` 会按字段默认值自动生成；`WPageRenderer` 渲染时也会用 `config.formData` 初始化页面状态。

## 扩展组件

通过 `registerComponent` 注册自定义页面组件：

```ts
import { registerComponent } from '@windows-ui/core'

registerComponent({
  type: 'my-component',
  label: '我的组件',
  category: 'display',
  isContainer: false,
  defaultNode: () => ({ type: 'my-component', props: { title: '示例' }, styles: {} }),
  render: ({ node }) => h('div', node.props.title)
})
```

## 主题定制

设计器内部使用 `--w-color-primary`、`--w-border-color`、`--w-bg-color` 等 CSS 变量，可通过 `WConfigProvider` 或覆盖 `:root` 变量调整外观。
