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
| mode | `'light' \| 'dark' \| 'auto'` | `'auto'` | 设计器主题模式，`auto` 跟随系统偏好 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| save | `data: any` | 点击保存后触发 |
| back | — | 点击返回后触发 |
| preview | — | 点击预览后触发 |

## 内置组件

- 布局：容器、卡片、栅格、标签页
- 展示：文本、图片、分隔线、统计卡片、图表、公告、标签、进度条、头像、徽标、步骤条、时间线、日历、轮播、描述列表、空状态、分页、结果页、骨架屏、分段控制器、树 等
- 数据：数据模型、仪表盘、报表
- 表单：输入框、选择器、单选框、多选框、开关、日期选择、自动补全、级联选择、颜色选择器、日期时间选择、数字输入、标签输入、验证码输入、提及输入、评分、滑块、时间选择、穿梭框、树选择、上传、富文本 等
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

## 页面与子页面

页面设计器将「页面」作为最高维度进行管理。顶部 tabs 默认显示「主页面」，点击「+ 子页面」可新增子页面，点击子页面 tab 可切换编辑，点击 tab 上的 × 可删除子页面。

每个页面（主页面/子页面）拥有独立的组件画布。页面配置支持 `subPages`，用于在当前页面内定义可被 `openDialog` 打开的弹窗子页面：

```json
{
  "title": "主页面",
  "subPages": [
    {
      "code": "user-form",
      "name": "用户表单",
      "config": {
        "components": [
          { "id": "i1", "type": "input", "props": { "label": "用户名", "field": "username" }, "styles": {} }
        ]
      }
    }
  ],
  "components": [
    {
      "id": "btn1",
      "type": "button",
      "props": { "label": "打开用户表单" },
      "events": { "onClick": { "action": "openDialog", "target": "user-form" } }
    }
  ]
}
```

点击左侧边栏的「页面信息」按钮，可在左侧面板中编辑当前选中页面的编码、名称与 JSON 配置。

## 事件与链式动作

交互组件（按钮、链接、图片等）支持配置 `onClick` 事件。事件配置支持：

- **执行条件**：通过 JS 表达式判断，如 `formData.status === '1'`，可引用 `formData` 与 `pageState`。
- **链式动作**：一个事件可配置多个动作，按顺序执行；每个动作也可单独设置条件。
- **动作类型**：跳转、打开弹窗、调用接口、设置变量、刷新页面、返回、打开外部链接。

```json
{
  "onClick": {
    "condition": "formData.agree === true",
    "actions": [
      { "action": "setVariable", "variable": "submitted", "value": true },
      { "action": "navigate", "target": "/success" }
    ]
  }
}
```

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

## 画布辅助

- 点击工具栏「网格」可显示/隐藏 20px 方格辅助线，便于对齐。
- 选中节点后按 `Delete` / `Backspace` 可快速删除，`Esc` 取消选中。
- 拖拽组件到画布或容器时，目标区域会高亮提示。
- 左侧边栏「大纲」可查看组件层级并快速选中节点。

## 深色模式

页面设计器支持独立切换深色模式，工具栏提供「深色/浅色」按钮，也可通过 `mode` prop 控制：

```vue
<w-page-designer code="sales_dashboard" mode="dark" />
```

深色模式通过切换 `html.dark` 类实现，依赖 `variables.css` 与 `dark.css` 中已定义的深色变量与组件覆盖样式。

## 组件库

- 左侧组件库按「布局 / 展示 / 表单 / 数据 / 交互」分组，分组支持收起展开。
- 每个组件项以图标 + 文字按钮形式展示，每行显示两个组件。
- 组件项尺寸跟随全局尺寸（small / default / large）。
- 顶部提供搜索框，支持按组件名称过滤。

## 属性面板

- 选中画布节点后，右侧面板展示对应属性表单。
- 属性表单统一使用 `WForm` / `WFormItem` 包裹，输入框、选择器、开关、颜色选择器、数字输入框等均使用 Windows UI 基础组件。
- 所有表单组件尺寸跟随 `WConfigProvider` 全局尺寸（small / default / large）。
- 复杂字段（数据源、事件）拆分为独立子编辑器，同样使用基础组件并支持尺寸联动。

## 画布操作

- 悬停或选中节点时显示节点工具栏，包含：添加子组件、上移、下移、删除，均使用图标按钮。
- 选中节点后按 `Delete` / `Backspace` 可快速删除，`Esc` 取消选中。
- 从左侧组件库拖拽组件到画布或容器时，根画布与容器区域会高亮提示；拖入容器后会自动选中子组件并记录历史。
- 工具栏提供撤销、重做、复制、粘贴、缩放、网格、深色模式、预览、保存等图标操作。

## 主题定制

设计器内部使用 `--w-color-primary`、`--w-border-color`、`--w-bg-color` 等 CSS 变量，可通过 `WConfigProvider` 或覆盖 `:root` 变量调整外观。所有内部按钮、输入框、表单均使用 Windows UI 基础组件，尺寸跟随 `WConfigProvider` 全局尺寸。
