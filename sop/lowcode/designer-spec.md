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
| options | array | 选项（`select/radio` 使用） |

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

## 扩展规范

新增组件类型时：

1. 在 `WDynamicForm` 中增加该类型的渲染分支。
2. 在表单设计器的 `formTypeOptions` 中增加选项。
3. 同步更新：
   - `docs/dynamic-form/usage.md`
   - `sop/lowcode/designer-spec.md`
   - `sop/manuals/lowcode/form-designer.md`
