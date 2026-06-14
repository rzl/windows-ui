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
