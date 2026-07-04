# 表单/列表设计器配置规范

> 本文档定义低代码平台中表单设计器与列表设计器保存的 JSON 配置结构，便于前后端解析与扩展。

## 表单设计器

### 字段配置项

| 属性 | 类型 | 说明 |
|------|------|------|
| field | string | 字段名（英文） |
| label | string | 显示名称 |
| type | string | 组件类型 |
| required | boolean | 是否必填 |
| validationRule | string | 后端校验规则编码 |
| dependsOn | object | 联动显示条件 |
| options | array | 静态选项（`select/radio/checkbox` 使用） |
| dynamicOptions | object | 动态选项配置 |
| codingRule | string | 编码规则编码，新增记录时自动生成编码 |
| refModel | string | 关联模型编码，`ref` 类型使用 |
| refDisplayField | string | 关联模型显示字段，`ref` 类型使用 |
| defaultValueType | string | 默认值类型：`constant`、`currentUser`、`currentTime`、`currentDept`、`field`、`expr` |
| defaultValueExpr | string | 默认值表达式，随类型不同含义不同 |

### dependsOn 结构

```json
{
  "field": "gender",
  "value": "2",
  "operator": "eq"
}
```

| 属性 | 说明 |
|------|------|
| field | 依赖字段名 |
| value | 依赖值 |
| operator | 条件操作符：`eq` / `ne` / `empty` / `notEmpty` |

### 支持的组件类型

| type | 组件 | 说明 |
|------|------|------|
| input | WInput | 文本输入 |
| textarea | WInput type="textarea" | 多行文本 |
| number | WInputNumber | 数字输入 |
| switch | WSwitch | 开关 |
| date | WDatePicker | 日期选择 |
| datetime | WDatePicker | 日期时间选择 |
| select | WSelect | 下拉选择 |
| radio | WRadioGroup | 单选组 |
| upload | WUpload | 文件上传 |
| cascader | WCascader | 级联选择 |
| rich-text | WRichText | 富文本编辑器 |
| ref | WSelect | 关联模型，需配置 `refModel` 与 `refDisplayField` |

### 示例

```json
{
  "fields": [
    {
      "field": "name",
      "label": "姓名",
      "type": "input",
      "required": true
    },
    {
      "field": "gender",
      "label": "性别",
      "type": "select",
      "required": false,
      "options": [
        { "label": "男", "value": "1" },
        { "label": "女", "value": "2" }
      ]
    },
    {
      "field": "city",
      "label": "城市",
      "type": "select",
      "dynamicOptions": {
        "type": "dict",
        "dependsOn": "province",
        "dictCode": "city"
      }
    }
  ]
}
```

### dynamicOptions 结构

| 属性 | 类型 | 说明 |
|------|------|------|
| type | string | 数据源类型：`dict` / `sql` / `api` / `script` |
| dependsOn | string | 依赖字段名，依赖值变化时重新加载 |
| dictCode | string | `dict` 类型使用的字典编码 |
| sql | string | `sql` 类型使用的只读查询 |
| api | object | `api` 类型的接口配置 |
| script | string | `script` 类型的执行脚本 |

## 列表设计器

### 字段配置项

| 属性 | 类型 | 说明 |
|------|------|------|
| field | string | 字段名 |
| label | string | 表头名称 |
| inTable | boolean | 是否在表格中显示 |
| searchable | boolean | 是否可在查询区使用 |
| sortable | boolean | 是否支持点击表头排序 |
| width | number | 列宽 |

### 示例

```json
{
  "fields": [
    {
      "field": "name",
      "label": "姓名",
      "inTable": true,
      "searchable": true,
      "sortable": true,
      "width": 120
    },
    {
      "field": "age",
      "label": "年龄",
      "inTable": true,
      "searchable": true,
      "sortable": true,
      "width": 80
    }
  ]
}
```

## 首页组件配置

### 组件（widget）结构

| 属性 | 类型 | 说明 |
|------|------|------|
| type | string | 组件类型：`stat` / `link` / `dashboard` / `notice` |
| title | string | 卡片标题 |
| icon | string | 图标名 |
| color | string | 颜色：`primary` / `success` / `warning` / `danger` |
| field | string | `stat` 类型使用，对应统计字段名 |
| dataSource | object | `stat` 类型的数据源配置，可选 |

### 统计卡片数据源

当 `type` 为 `stat` 时，可通过 `dataSource` 动态获取统计值。未配置数据源时，优先使用后端默认统计（`userCount` / `modelCount` / `messageCount`）。

```json
{
  "type": "stat",
  "title": "今日订单",
  "field": "orderCount",
  "icon": "order",
  "color": "primary",
  "dataSource": {
    "type": "sql",
    "sql": "SELECT count(*) as count FROM orders WHERE date(create_time) = date('now')"
  }
}
```

`dataSource.type` 支持：

| 类型 | 字段 | 说明 |
|------|------|------|
| `static` | `value` | 固定值 |
| `sql` | `sql` | 只读 SELECT 查询，结果取首条数据的第一个数字或首个字段 |
| `api` | `api.method` / `api.url` | 调用内部接口，返回 data 字段 |
| `script` | `script` | 在线 JS 脚本，可调用 `db.raw()` 与 `http()` |

### 编码规则

当字段配置了 `codingRule` 后，动态表单在新增模式下会自动调用编码规则生成接口回填该字段值；后端 `dynamicCreate` 也会在字段为空时兜底生成，确保直接调用 API 时编码一致。

```json
{
  "field": "orderNo",
  "label": "订单编号",
  "type": "input",
  "codingRule": "ORDER_NO"
}
```

### 关联模型

当字段类型为 `ref` 时，需要配置 `refModel`（关联模型编码）与 `refDisplayField`（关联模型显示字段）。动态表单会以下拉选择方式展示关联记录，列表中会显示关联记录的值而非原始 ID。

```json
{
  "field": "customerId",
  "label": "客户",
  "type": "ref",
  "refModel": "customer",
  "refDisplayField": "name"
}
```

### 流程设计

流程配置通过可视化设计器完成，支持的节点类型：

- `start`：开始节点
- `approve`：审批节点（支持角色/用户/部门审批）
- `cc`：抄送节点
- `condition`：条件分支节点
- `sign`：会签节点（全部通过 / 一人通过）
- `end`：结束节点

流程保存后存储为 `{ nodes: FlowNode[], transitions: FlowTransition[] }` 结构，后端流程引擎按此执行。

详细使用说明见 [flow-designer.md](./flow-designer.md)。

### 数据权限

模型级数据权限在「模型信息」中配置：

| 权限范围 | 说明 |
|----------|------|
| `all` | 全部可见 |
| `self` | 仅本人创建的数据 |
| `dept` | 本部门数据 |
| `dept_and_child` | 本部门及子部门数据 |

前端 `LowcodePage` 会根据 `/lowcode/models/code/:code/permission` 返回的权限控制页面元素：

- `none`：显示无权限提示，不渲染列表
- 操作权限：`canCreate`、`canEdit`、`canDelete`、`canExport`、`canImport`
- 设计权限：`canDesign`（仅管理员）

`ModelList` 对普通用户自动过滤掉 `data_permission = 'none'` 的模型；模型设计器仅管理员可保存配置。

### 列表设计

列表配置支持以下字段级属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| inTable | boolean | 是否在列表显示 |
| format | string | 列格式化：`date`、`datetime`、`number`、`money`、`percent`、`boolean`、`dict` |
| align | string | 对齐方式：`left`、`center`、`right` |
| fixed | string | 固定列：`left`、`right` |
| searchable | boolean | 是否可查询 |
| searchMode | string | 查询方式：`eq`、`like`、`between`、`gt`、`lt`、`gte`、`lte` |
| sortable | boolean | 是否可排序 |
| width | number | 列宽 |

表格级配置：

| 属性 | 类型 | 说明 |
|------|------|------|
| toolbar | string[] | 工具栏按钮：`create`、`batchDelete`、`export`、`import` |
| rowActions | string[] | 行操作按钮：`edit`、`delete`、`view` |

### 默认值表达式

字段支持配置动态默认值，新增记录时自动填充。

```json
{
  "field": "createBy",
  "label": "创建人",
  "type": "input",
  "defaultValueType": "currentUser"
}
```

支持的类型：

| 类型 | 说明 | `defaultValueExpr` 含义 |
|------|------|------------------------|
| `constant` | 常量 | 直接作为字段值 |
| `currentUser` | 当前用户 | 无需填写，取 `userInfo.id` |
| `currentDept` | 当前部门 | 无需填写，取 `userInfo.deptId` |
| `currentTime` | 当前时间 | 无需填写，根据字段类型返回日期或日期时间 |
| `field` | 关联字段 | 填写其他字段名，取该字段当前值 |
| `expr` | 表达式 | 填写 JS 表达式，例如 `date('Y-m-d')` |

后端 `dynamicCreate` 也会在字段为空时兜底计算默认值。

### 扩展规范

#### 通过插件扩展（推荐）

平台已支持通过「插件市场」扩展字段类型、图表类型和页面组件，无需修改核心代码：

1. 字段类型扩展：在插件 `contributions.fieldTypes` 中声明，运行时由 `fieldTypeRegistry` 消费。
2. 图表类型扩展：在插件 `contributions.charts` 中声明，运行时调用 `api.registerChart` 注册渲染器。
3. 页面组件扩展：在插件 `contributions.components` 中声明，运行时调用 `api.registerComponent` 注册组件。

详细开发指南见 [plugin.md](../manuals/lowcode/plugin.md)。

#### 手动扩展（不推荐）

新增组件类型时：

1. 在 `WDynamicForm` 中增加该类型的渲染分支。
2. 在表单设计器的 `formTypeOptions` 中增加选项。
3. 同步更新：
   - `docs/dynamic-form/usage.md`
   - `sop/lowcode/designer-spec.md`
   - `sop/manuals/lowcode/form-designer.md`

扩展首页统计数据源类型时：

1. 在 `dashboard.service.ts` 的 `executeDataSource` 或 `resolveStatValue` 中处理新类型。
2. 在 `HomepageConfig.vue` 中增加对应配置项。
3. 同步更新 `sop/manuals/lowcode/homepage-config.md`。

## 自定义页面设计器

### 页面配置结构

`lowcode_pages.config` 存储完整的页面 JSON 配置：

```json
{
  "title": "页面标题",
  "description": "页面描述",
  "formData": { "username": "" },
  "components": [
    {
      "id": "comp_xxx",
      "type": "text",
      "props": { "content": "Hello", "tag": "p", "align": "left" },
      "styles": { "marginTop": "12px" },
      "dataSource": { "type": "static", "value": "" },
      "events": {
        "onClick": {
          "condition": "formData.agree === true",
          "actions": [
            { "action": "setVariable", "variable": "submitted", "value": true },
            { "action": "navigate", "target": "/success" }
          ]
        }
      }
    }
  ]
}
```

### 通用字段

| 属性 | 类型 | 说明 |
|------|------|------|
| id | string | 组件实例唯一标识 |
| type | string | 组件类型 |
| props | object | 组件属性 |
| styles | object | 自定义样式（marginTop、marginBottom、marginLeft、marginRight、width 等） |
| children | array | 容器类组件的子组件 |
| dataSource | object | 数据绑定配置 |
| events | object | 交互事件配置 |
| tab | string | 在 `tabs` 容器中表示所属标签页 |

### 布局组件

| type | 说明 | props |
|------|------|-------|
| container | 容器 | padding |
| card | 卡片 | title |
| row | 栅格 | columns、gap |
| tabs | 标签页 | tabs（数组：{title, name}） |

### 展示组件

| type | 说明 | props |
|------|------|-------|
| text | 文本 | content、tag、align |
| image | 图片 | src、alt、width、height、objectFit |
| divider | 分隔线 | text、direction、margin |
| statistic | 统计卡片 | title、value、prefix、suffix、precision、icon、color、valueStyle |
| chart | 图表 | title、height、chartType、option |
| alert | 公告 | content、type |
| tag | 标签 | label、type |
| progress | 进度条 | percentage、status、width、showText |
| avatar | 头像 | src、alt、icon、shape |
| badge | 徽标 | text、value、isDot、type |
| steps | 步骤条 | items、active |
| timeline | 时间线 | items |
| table | 表格 | title、columns、height、dataSource |
| list | 列表 | itemTitle、itemDesc、itemIcon、dataSource |

### 数据组件

| type | 说明 | props |
|------|------|-------|
| model | 嵌入模型 CRUD 页面 | modelCode、height |
| dashboard | 嵌入仪表盘 | dashboardCode |
| report | 嵌入报表 | reportCode |

### 表单组件

| type | 说明 | props |
|------|------|-------|
| input | 输入框 | label、placeholder、type、field、modelValue |
| select | 选择器 | label、placeholder、options、field、modelValue |
| radio | 单选框 | label、options、field、modelValue |
| checkbox | 多选框 | label、options、field、modelValue |
| switch | 开关 | label、field、modelValue |
| date-picker | 日期选择 | label、placeholder、field、modelValue |

表单组件通过 `props.field` 与页面级 `formData` 双向绑定；未配置 `field` 时仅作为默认值展示。

### 交互组件

| type | 说明 | props / events |
|------|------|----------------|
| button | 按钮 | label、type；events.onClick.action |
| link | 链接 | label、path |

### 数据源配置

| type | 字段 | 说明 |
|------|------|------|
| static | value | 静态值 |
| sql | sql / transformScript | 只读 SELECT 查询，可附加转换脚本 |
| api | api.method / api.url / api.params / api.body / transformScript | 调用内部接口 |
| script | script | 在线 JS 脚本，可调用 `db.raw()` 与 `http()` |

### 画布交互

- 左侧组件库拖拽/点击添加组件；容器组件（container/card/row/tabs）可嵌套子组件。
- 工具栏提供撤销/重做、复制/粘贴、缩放、网格显示、预览、保存。
- 选中节点后按 `Delete` / `Backspace` 删除，`Esc` 取消选中。
- 拖拽到画布或容器时，目标区域会高亮提示。
- 按住 `Ctrl` + 滚轮可缩放画布。

### 事件动作

单个事件可包含 `condition` 执行条件表达式，以及 `actions` 链式动作数组。条件表达式可访问 `formData` 与 `pageState`。

| action | target / 其他字段 | 说明 |
|--------|-------------------|------|
| navigate | target：路由路径 | 跳转页面 |
| openExternal | target：URL | 打开外部链接 |
| openDialog | target：页面编码 / URL | 打开弹窗 |
| callApi | target、method、params、body | 调用接口 |
| setVariable | variable、value | 设置 pageState 变量 |
| refresh | - | 刷新当前组件数据源 |
| goBack | - | 返回上一页 |

```json
{
  "onClick": {
    "condition": "formData.status === '1'",
    "actions": [
      { "action": "setVariable", "variable": "done", "value": true },
      { "action": "navigate", "target": "/detail" }
    ]
  }
}
```

