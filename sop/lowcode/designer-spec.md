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
| options | array | 选项（`select/radio` 使用） |

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
    }
  ]
}
```

## 列表设计器

### 字段配置项

| 属性 | 类型 | 说明 |
|------|------|------|
| field | string | 字段名 |
| label | string | 表头名称 |
| inTable | boolean | 是否在表格中显示 |
| searchable | boolean | 是否可在查询区使用 |
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
      "width": 120
    },
    {
      "field": "age",
      "label": "年龄",
      "inTable": true,
      "searchable": true,
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
