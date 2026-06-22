# 插件市场使用手册

## 概述

插件市场是低代码平台的扩展入口。管理员可以通过安装插件，为平台新增自定义字段类型、自定义图表类型和自定义页面组件，而无需修改平台核心代码。

## 进入插件市场

1. 登录低代码平台。
2. 在左侧菜单选择「在线开发 > 插件市场」。
3. 页面展示已安装插件列表，可进行启用、禁用、编辑、删除操作。

## 安装内置示例插件

1. 点击顶部「安装示例插件」按钮。
2. 在对话框中选择示例：
   - **词云图表**：在页面设计器的图表组件中新增「词云」类型。
   - **倒计时组件**：在页面设计器中新增「倒计时」可拖拽组件。
3. 对话框会自动填充示例插件 JSON，点击「安装」即可。
4. 安装成功后，插件立即生效，无需刷新页面。

## 手动创建插件

1. 点击「+ 新增插件」。
2. 填写基础信息：
   - **编码**：唯一标识，建议使用 `vendor-type` 命名空间，如 `mycompany-rating`。
   - **名称**：插件显示名称。
   - **版本**：如 `1.0.0`。
   - **类型**：`mixed`（混合）、`component`（组件）、`field`（字段类型）、`chart`（图表）。
   - **状态**：启用或禁用。
3. 在「贡献声明」中填写 `contributions` JSON，声明插件提供的字段类型、图表、组件。
4. 在「运行时脚本」中编写 ES Module 脚本，调用 `api` 注册图表或组件。
5. 点击「保存插件」。

## 插件包格式

```json
{
  "code": "example-plugin",
  "name": "示例插件",
  "version": "1.0.0",
  "description": "演示插件能力",
  "type": "mixed",
  "contributions": {
    "fieldTypes": [
      { "type": "rating", "label": "评分", "dbType": "integer", "formType": "number", "format": "number" }
    ],
    "charts": [
      { "type": "wordcloud", "label": "词云" }
    ],
    "components": [
      { "type": "countdown", "label": "倒计时", "category": "display", "icon": "clock" }
    ]
  },
  "runtimeCode": "export default function (api) { ... }"
}
```

### contributions 字段说明

| 字段 | 说明 |
|------|------|
| `fieldTypes` | 自定义字段类型数组，`dbType` 会用于创建物理表列，`formType` 会映射到表单控件。 |
| `charts` | 自定义图表类型数组，运行时需调用 `api.registerChart` 提供渲染器。 |
| `components` | 自定义页面组件数组，运行时需调用 `api.registerComponent` 提供渲染器与默认节点。 |

### 运行时 API

运行时脚本导出一个默认函数，接收 `api` 对象：

```js
export default function (api) {
  api.registerChart({
    type: 'wordcloud',
    label: '词云',
    defaultOption: () => ({ words: [] }),
    render(option, props, data) {
      // 返回完整 HTML 文档字符串，页面设计器会通过 iframe 加载
      return '<!DOCTYPE html><html>...</html>'
    }
  })
}
```

可用 API：

- `api.h`：Vue `h` 函数。
- `api.defineComponent`：定义 Vue 组件。
- `api.ref` / `api.computed` / `api.watch` / `api.onMounted`：Vue 组合式 API。
- `api.registerChart(def)`：注册图表。
- `api.registerComponent(def)`：注册页面组件。
- `api.registerFieldType(def)`：动态注册字段类型（通常通过 `contributions` 声明即可）。

### 页面组件定义示例

```js
export default function (api) {
  const MyComponent = api.defineComponent({
    props: ['node'],
    setup(props) {
      return () => api.h('div', { style: props.node.styles }, props.node.props.text)
    }
  })

  api.registerComponent({
    type: 'my-text',
    label: '我的文本',
    category: 'display',
    icon: 'text',
    isContainer: false,
    defaultNode: () => ({
      type: 'my-text',
      props: { text: 'Hello Plugin' },
      styles: {}
    }),
    render: (ctx) => api.h(MyComponent, { node: ctx.node })
  })
}
```

## 插件状态

- **启用**：插件贡献的类型会出现在设计器中，运行时脚本会被执行。
- **禁用**：插件贡献的类型从设计器中隐藏；已保存页面运行时会显示「未知组件」降级提示。
- **删除**：彻底移除插件记录，相关页面可能显示降级提示。

## 注意事项

1. 插件编码必须唯一，且只能包含字母、数字、下划线、中划线。
2. 运行时脚本在管理端执行，当前按管理员可信处理，请勿安装来源不明的插件。
3. 字段类型的 `dbType` 目前支持：`string`、`text`、`integer`、`tinyint`、`boolean`、`datetime`、`decimal`、`json`。
4. 图表渲染器需要返回完整 HTML 文档字符串，页面设计器会通过 sandboxed iframe 加载。
