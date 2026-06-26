# 阶段二十六：高级查询面板

## 目标

为低代码运行页的数据列表提供高级查询能力，支持字段组合条件、多种运算符、范围查询、空值判断，并允许用户保存常用查询条件，提升复杂业务场景下的数据检索体验。

## 功能清单

### 1. 复杂查询条件

- 支持条件组嵌套：
  - `and`：所有条件同时满足。
  - `or`：任一条件满足。
- 支持单字段运算符：
  - `eq`：等于
  - `ne`：不等于
  - `gt`：大于
  - `gte`：大于等于
  - `lt`：小于
  - `lte`：小于等于
  - `like` / `notLike`：包含 / 不包含
  - `startsWith` / `endsWith`：开头是 / 结尾是
  - `in` / `notIn`：在列表中 / 不在列表中
  - `isNull` / `isNotNull`：为空 / 不为空
  - `between`：范围（日期、数字）
- 字段类型与可用运算符映射：
  - 字符串：`eq`, `ne`, `like`, `notLike`, `startsWith`, `endsWith`, `in`, `notIn`, `isNull`, `isNotNull`
  - 数字/日期：`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `between`, `isNull`, `isNotNull`
  - 下拉/关联：`eq`, `ne`, `in`, `notIn`, `isNull`, `isNotNull`

### 2. 查询面板 UI

- 新增 `WAdvancedQueryBuilder` 组件：
  - 条件行：字段选择 + 运算符选择 + 值输入。
  - 条件组：可添加嵌套子条件组。
  - 条件组逻辑切换：AND / OR。
  - 删除单行或整组条件。
- 在 `LowcodePage.vue` 中替换原有简单查询区。

### 3. 常用查询保存

- 后端新增 `lowcode_saved_queries` 表：
  - `id`：主键
  - `model_code`：数据模型编码
  - `user_id`：用户 ID
  - `name`：查询名称
  - `filters`：查询条件 JSON
  - `is_default`：是否为默认查询
  - `create_time` / `update_time`
- API：
  - `GET /api/lowcode/:modelCode/saved-queries`：当前用户常用查询列表。
  - `POST /api/lowcode/:modelCode/saved-queries`：保存查询。
  - `PUT /api/lowcode/:modelCode/saved-queries/:id`：更新查询。
  - `DELETE /api/lowcode/:modelCode/saved-queries/:id`：删除查询。
  - `POST /api/lowcode/:modelCode/saved-queries/:id/default`：设为默认。
- 前端：
  - 查询面板中展示「常用查询」下拉列表。
  - 支持保存当前查询、加载已保存查询、删除查询、设为默认。
  - 进入页面时自动加载默认查询。

### 4. 兼容与默认行为

- 原有简单查询（`w-query-builder` + `filters` 字符串）保留兼容。
- 高级查询条件序列化为 JSON 后通过 `filters` 参数传递，后端识别对象结构后解析。
- 每个用户只能看到自己的常用查询。

## 数据表

### lowcode_saved_queries

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| model_code | varchar(100) | 模型编码 |
| user_id | int | 用户 ID |
| name | varchar(100) | 查询名称 |
| filters | json/text | 查询条件 JSON |
| is_default | tinyint | 1 默认，0 非默认 |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/lowcode/:modelCode/saved-queries | 常用查询列表 |
| POST | /api/lowcode/:modelCode/saved-queries | 保存查询 |
| PUT | /api/lowcode/:modelCode/saved-queries/:id | 更新查询 |
| DELETE | /api/lowcode/:modelCode/saved-queries/:id | 删除查询 |
| POST | /api/lowcode/:modelCode/saved-queries/:id/default | 设为默认 |

动态 CRUD 列表查询仍使用 `GET /api/lowcode/:modelCode`，`filters` 参数支持两种格式：

```json
// 旧格式（简单条件数组）
[{"field":"name","op":"like","value":"张"}]

// 新格式（复杂条件对象）
{
  "logic": "and",
  "conditions": [
    { "field": "name", "op": "like", "value": "张" },
    { "logic": "or", "conditions": [
      { "field": "age", "op": "gt", "value": 30 },
      { "field": "status", "op": "eq", "value": "vip" }
    ]}
  ]
}
```

## 核心实现思路

### 后端过滤器解析

1. 判断 `filters` 是数组还是对象。
2. 数组按旧逻辑处理。
3. 对象递归构建 Knex 查询：
   - `logic: 'and'` → 所有条件用 `andWhere` 连接。
   - `logic: 'or'` → 用 `where((builder) => { ... })` 包裹。
   - 每个条件根据 `op` 转换为对应 SQL 片段。

### 高级查询面板组件

1. 接收 `fields` 列表（字段名、类型、标签）。
2. 内部维护条件树：`{ logic: 'and', conditions: [] }`。
3. 每个条件行渲染字段选择、运算符选择、值输入。
4. 触发 `search` 事件时输出条件对象。

### 常用查询保存

1. 保存时将当前条件对象 + 名称写入 `lowcode_saved_queries`。
2. 同一模型下同一用户只能有一个默认查询；设置默认时取消其他默认。
3. 进入 LowcodePage 时调用 `GET /api/lowcode/:modelCode/saved-queries`，若存在默认查询则自动应用。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260627010000_create_lowcode_saved_queries.ts` | 常用查询表迁移 |
| `packages/server/src/modules/lowcode/query.service.ts` | 复杂查询条件解析服务 |
| `packages/server/src/modules/lowcode/saved-query.service.ts` | 常用查询 CRUD 服务 |
| `packages/server/src/modules/lowcode/saved-query.controller.ts` | 常用查询控制器 |
| `packages/windows-ui/src/components/advanced-query-builder/advanced-query-builder.vue` | 高级查询面板组件 |
| `packages/windows-ui/src/components/advanced-query-builder/advanced-query-group.vue` | 高级查询条件组递归组件 |
| `packages/lowcode-admin/src/api/lowcode.ts` | 前端常用查询 API（与 lowcode API 同文件） |
| `sop/progress/by-phase/phase-26.md` | 本阶段进度文档 |
| `sop/manuals/lowcode/advanced-query.md` | 用户手册 |
| `docs/advanced-query-builder/usage.md` | 组件使用文档 |
| `designs/advanced-query-builder/design.md` | 组件设计文档 |
| `develops/advanced-query-builder/progress.md` | 组件开发进度 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/lowcode.service.ts` | 扩展 `filters` 解析支持复杂条件 |
| `packages/server/src/modules/lowcode/lowcode.routes.ts` | 注册常用查询路由 |
| `packages/server/src/modules/lowcode/query.service.ts` | 增加 `startsWith` / `endsWith` 运算符 |
| `packages/lowcode-admin/src/views/lowcode/LowcodePage.vue` | 集成高级查询面板与常用查询 |
| `packages/windows-ui/src/index.ts` | 注册并导出 WAdvancedQueryBuilder |

## 任务清单

- [x] 数据库迁移：创建 `lowcode_saved_queries` 表
- [x] 后端：复杂查询条件解析
- [x] 后端：常用查询 CRUD 接口
- [x] 后端：注册常用查询路由
- [x] 后端：`startsWith` / `endsWith` 运算符支持
- [x] 前端：WAdvancedQueryBuilder 组件
- [x] 前端：常用查询 API 封装
- [x] 前端：LowcodePage 集成高级查询面板
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build`、`pnpm --filter @windows-ui/core test`、`pnpm build:lowcode`

## 验收标准

1. [x] 高级查询面板支持 AND/OR 嵌套条件组。
2. [x] 支持多种运算符，范围查询与空值判断生效。
3. [x] 复杂查询条件能通过 `filters` 参数正确返回数据。
4. [x] 用户可以保存、加载、删除、设置默认常用查询。
5. [x] 进入列表页时自动加载默认查询。
6. [x] 原有简单查询条件格式保持兼容。
7. [x] `pnpm db:migrate`、`pnpm build`、`pnpm --filter @windows-ui/core test`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **SQL 注入**：复杂查询条件中的 `field` 字段需继续依赖字段白名单位置的校验，当前实现未做字段白名单，需依赖前端传入合法字段名。后续可考虑增加字段白名单校验。
2. **嵌套深度**：为避免过于复杂的查询导致性能问题，可限制条件组最大嵌套层数为 3 层。
3. **between 值格式**：between 条件值使用数组 `[start, end]`，由前端统一格式。
4. **用户隔离**：常用查询按 `user_id` 隔离，管理员无法查看其他用户保存的查询。
