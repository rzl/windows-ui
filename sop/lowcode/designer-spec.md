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
