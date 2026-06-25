# 动态 CRUD API 约定

> 低代码平台根据数据模型配置自动生成 RESTful API，无需手写每个业务模块的接口。

## 基础路径

```
/api/lowcode/:modelCode
```

## 接口列表

### 查询列表

```http
GET /api/lowcode/:modelCode
```

**查询参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码，默认 1 |
| pageSize | number | 每页条数，默认 10 |
| keyword | string | 关键词，对字符串/文本字段做模糊搜索 |
| filters | string | JSON 数组，高级查询条件 |

**filters 格式**：

```json
[
  { "field": "name", "operator": "like", "value": "张" },
  { "field": "age", "operator": "gte", "value": 18 }
]
```

**支持的操作符**：

| 操作符 | SQL 语义 |
|--------|----------|
| eq | `=` |
| ne | `!=` |
| like | `LIKE '%value%'` |
| between | `BETWEEN value[0] AND value[1]` |
| gt | `>` |
| lt | `<` |
| gte | `>=` |
| lte | `<=` |

**响应**：

```json
{
  "code": 200,
  "data": {
    "list": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10
  },
  "message": "success"
}
```

### 查询详情

```http
GET /api/lowcode/:modelCode/:id
```

## 关联关系展开

动态 CRUD 接口支持通过 `expand` 参数展开模型字段中配置的关联关系，便于一次性返回关联对象或关联列表。

### 列表查询展开

```http
GET /api/lowcode/:modelCode?expand=fieldName1,fieldName2
```

返回结果中，每个展开字段（`ref` 字段名）会替换为关联数据对象或对象数组：

```json
{
  "id": 1,
  "customer_id_display": "张三",
  "customer_id": {
    "id": 5,
    "name": "张三",
    "phone": "13800000000"
  }
}
```

- `belongsTo` 关系：返回单个对象。
- `hasMany` 关系：返回对象数组。
- `manyToMany` 关系：通过中间表查询，返回对象数组。

未指定 `expand` 时，`ref` 字段仍保留原始外键值，同时自动返回 `${field_name}_display` 作为显示文本。

### 详情查询展开

```http
GET /api/lowcode/:modelCode/:id?expand=fieldName1,fieldName2
```

展开规则与列表查询一致。

### 关联选项加载

表单中的 `ref` 字段可通过如下接口加载关联模型列表作为下拉选项：

```http
GET /api/lowcode/:targetModelCode
```

前端会根据字段的 `ref_filter` 自动追加 `filters` 参数；列表接口返回 `data.list` 作为选项数据，展示字段使用 `ref_display_field` 指定的字段。

### 新增

```http
POST /api/lowcode/:modelCode
Content-Type: application/json

{ ...data }
```

### 更新

```http
PUT /api/lowcode/:modelCode/:id
Content-Type: application/json

{ ...data }
```

### 删除

```http
DELETE /api/lowcode/:modelCode/:id
```

## 数据清洗

新增/更新时，后端会根据 `lowcode_fields` 的字段类型自动转换数据：

- `number` / `integer` → Number
- `boolean` / `switch` → 1 / 0
- 其他 → 原值

保留字段 `id`、`create_time`、`update_time` 不允许由前端传入修改。

## 模型权限

```http
GET /api/lowcode/models/code/:code/permission
```

返回当前登录用户对该模型的数据权限与操作权限：

```json
{
  "code": 200,
  "data": {
    "dataScope": "all",
    "canCreate": true,
    "canEdit": true,
    "canDelete": true,
    "canExport": true,
    "canImport": true,
    "canDesign": true
  }
}
```

`dataScope` 取值：

| 值 | 说明 |
|---|------|
| `all` | 全部数据 |
| `self` | 仅本人数据 |
| `dept` | 本部门数据 |
| `dept_and_child` | 本部门及子部门数据 |
| `none` | 无权限，前端应阻止访问 |

管理员（`roleId === 1` 或拥有 `*` 权限）自动拥有全部权限。

## 数据导入导出

### Excel 导出

```http
POST /api/lowcode/:modelCode/export
Content-Type: application/json

{
  "ids": [1, 2],
  "columns": [
    { "field": "name", "label": "名称", "type": "string", "format": "" },
    { "field": "status", "label": "状态", "type": "select", "format": "dict", "dictCode": "status" }
  ]
}
```

- `ids`：可选，指定导出记录 ID 数组；为空则导出全部（上限 10000 条）。
- `columns`：可选，指定导出列；为空则使用模型全部字段。
- 关联字段会自动使用 `${field}_display` 显示值。
- 支持格式化：`date`、`datetime`、`money`、`percent`、`boolean`。

响应为 `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` 二进制流。

### Excel 导入

```http
POST /api/lowcode/:modelCode/import-excel
Content-Type: multipart/form-data

file=<Excel 文件>
```

Excel 第一行应为字段显示名（`display_name`），后续每行为一条记录。后端按行创建数据，自动填充默认值、校验规则、编码规则，并返回导入结果：

```json
{
  "code": 200,
  "data": {
    "total": 100,
    "success": 98,
    "failure": 2,
    "failures": [
      { "row": 3, "reason": "字段 xxx 必填" }
    ]
  },
  "message": "success"
}
```

### 导入模板下载

```http
GET /api/lowcode/:modelCode/template
```

返回 Excel 模板文件，包含字段显示名表头与一行示例数据，方便用户按格式填写后导入。

## 数据审计日志

### 查询审计日志

```http
GET /api/audit-logs
```

**查询参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| modelCode | string | 模型编码 |
| action | string | 操作类型：`create` / `update` / `delete` |
| recordId | number | 记录 ID |
| operatorName | string | 操作人姓名/用户名，模糊匹配 |
| startTime | string | 开始时间，格式 `YYYY-MM-DD HH:mm:ss` |
| endTime | string | 结束时间，格式 `YYYY-MM-DD HH:mm:ss` |
| page | number | 页码，默认 1 |
| pageSize | number | 每页条数，默认 20 |

**响应**：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "model_code": "customer",
        "record_id": 12,
        "action": "update",
        "operator_name": "管理员",
        "ip": "127.0.0.1",
        "diff": { "name": { "before": "张三", "after": "张三丰" } },
        "create_time": "2024-01-01 12:00:00"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  },
  "message": "success"
}
```

### 审计日志详情

```http
GET /api/audit-logs/:id
```

返回单条审计日志完整信息，包括 `before`、`after`、`diff` JSON 字段。

### 操作类型列表

```http
GET /api/audit-logs/actions
```

返回 `['create', 'update', 'delete']`，供前端筛选下拉框使用。

### 启用审计

在模型设计器的“基础设置”中开启“数据审计”开关并保存，或在更新模型接口中传入 `enableAudit: 1`：

```http
PUT /api/lowcode/models/:id
Content-Type: application/json

{ "enableAudit": 1 }
```

开启后，该模型通过动态 CRUD 接口产生的新增、修改、删除、批量删除、导入操作会自动记录审计日志。

## 自定义接口

对于数据模型无法满足的复杂查询、聚合计算或跨系统整合，可使用「自定义接口」功能在线编写脚本并发布为 `/api/custom/*` 接口。详见 [自定义接口使用手册](../manuals/lowcode/custom-api.md)。
