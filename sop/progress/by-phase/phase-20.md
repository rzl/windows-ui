# 阶段二十：数据模型关联关系

## 目标

在现有单表动态 CRUD 基础上，补齐数据模型之间的关联关系能力，支持一对多、多对多及简单的引用关系。关联关系打通后，业务人员可在表单中使用下拉选择关联数据、在列表中展示关联字段、在页面设计器中使用关联数据源，从而覆盖更复杂的业务建模场景。

## 功能清单

### 1. 关联关系元数据

- 新增 `lowcode_model_relations` 表，存储模型间关系定义：
  - `code`：关系编码
  - `name`：关系名称
  - `source_model`：源模型编码
  - `target_model`：目标模型编码
  - `relation_type`：`belongsTo` / `hasMany` / `manyToMany`
  - `source_field`：源模型中的外键字段
  - `target_field`：目标模型中的关联字段（通常为 `id`）
  - `junction_table`：manyToMany 时的中间表名
  - `status`：启用/禁用
- 扩展 `lowcode_fields` 已有字段 `ref_model`、`ref_display_field`，新增 `ref_relation`（关联关系编码）与 `ref_filter`（关联数据筛选条件 JSON）。

### 2. 后端能力

- 新增 `relation.service.ts`：关联关系 CRUD、根据关系生成 Knex join/子查询、校验关联数据合法性。
- 新增 `relation.controller.ts` 与路由：
  - `/api/lowcode/relations`：关系管理 CRUD
  - `/api/lowcode/relations/:code/options`：获取关联模型的可选数据（用于下拉选择）
- 动态 CRUD 查询（`/:modelCode`）支持 `?expand=field1,field2` 参数，自动 leftJoin 关联表并返回关联对象/数组。
- 动态 CRUD 保存/更新时校验关联字段值是否存在于目标模型。
- 删除模型/数据时，根据关系配置进行保护或级联提示（本期先做保护提示，不做物理级联删除）。

### 3. 前端能力

- 模型设计器新增「关联关系」Tab：可视化创建/编辑关系。
- 字段配置面板新增「关联类型」：选择关系后自动填充 `ref_model`、`ref_display_field`、`ref_relation`。
- 表单设计器：关联字段渲染为 `w-select`（单选/多选），支持搜索、分页加载、显示字段配置。
- 列表设计器：列配置可选择「关联字段」，列表渲染时自动显示关联对象的展示字段。
- 低代码运行页（`LowcodePage.vue`）：表单与表格自动识别关联字段并调用 expand 接口。
- 页面设计器数据源：SQL/API 脚本中可通过关系编码引用关联数据（预留能力，本期先保证基础渲染）。

### 4. 兼容与默认行为

- 未配置关联关系时，所有现有模型与接口行为保持不变。
- 已有 `ref_model` / `ref_display_field` 的字段自动视为 `belongsTo` 简易引用，无需额外配置关系即可使用。
- 超级管理员与普通用户均受数据权限控制，关联查询时同步注入源模型与目标模型的数据权限条件。

## 数据表

### lowcode_model_relations

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| code | varchar(50) UNIQUE | 关系编码 |
| name | varchar(100) | 关系名称 |
| source_model | varchar(100) | 源模型编码 |
| target_model | varchar(100) | 目标模型编码 |
| relation_type | varchar(20) | belongsTo / hasMany / manyToMany |
| source_field | varchar(100) | 源模型外键字段 |
| target_field | varchar(100) | 目标模型字段，默认 id |
| junction_table | varchar(100) | manyToMany 中间表名，可为空 |
| status | tinyint | 0 禁用 / 1 启用 |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

### lowcode_fields（扩展）

| 字段 | 类型 | 说明 |
|------|------|------|
| ref_relation | varchar(50) | 关联关系编码 |
| ref_filter | json | 关联数据筛选条件，如 `{ "status": 1 }` |

## 接口约定

### 关联关系管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/lowcode/relations | 关系列表 |
| GET | /api/lowcode/relations/:id | 关系详情 |
| POST | /api/lowcode/relations | 创建关系 |
| PUT | /api/lowcode/relations/:id | 更新关系 |
| DELETE | /api/lowcode/relations/:id | 删除关系 |
| GET | /api/lowcode/relations/:code/options | 获取关联可选数据 |

### 动态 CRUD 扩展

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/lowcode/:modelCode?expand=customer,category | 列表查询并展开关联字段 |
| GET | /api/lowcode/:modelCode/:id?expand=customer,category | 详情查询并展开关联字段 |

## 核心实现思路

### belongsTo 查询展开

以订单（order）关联客户（customer）为例：

1. `lowcode_fields` 中存在字段 `customer_id`，其 `ref_model='customer'`、`ref_display_field='name'`、`ref_relation='order_customer'`。
2. 请求 `GET /api/lowcode/order?expand=customer`。
3. 后端解析 `expand` 参数，根据 `ref_relation` 找到关系定义。
4. 对主查询执行 `.leftJoin('lc_customer as rel_customer', 'lc_order.customer_id', 'rel_customer.id')`。
5. 查询列追加 `rel_customer.name as customer__name`。
6. 返回结果中把 `customer__name` 组装为嵌套对象：
   ```json
   { "id": 1, "customer_id": 5, "customer": { "id": 5, "name": "ABC 公司" } }
   ```

### hasMany 查询展开

以部门（dept）关联用户（user，dept_id 在用户表）为例：

1. 关系类型为 `hasMany`，`source_model='dept'`，`target_model='user'`，`source_field='id'`，`target_field='dept_id'`。
2. 主查询返回部门列表后，对每个结果再查询目标表生成子数组，或在 SQL 中使用 JSON 聚合（SQLite 3.38+ 支持 `json_group_array`）。
3. 本期优先采用应用层二次查询方案，避免数据库兼容性问题。

### manyToMany 查询展开

1. 通过 `junction_table` 中间表建立多对多关系。
2. 查询时先取主数据，再通过中间表批量查询关联 ID，最后查询目标表数据并组装。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260624010000_create_lowcode_model_relations.ts` | 关联关系表迁移 |
| `packages/server/migrations/20260624010100_add_relation_fields_to_lowcode_fields.ts` | 字段表扩展迁移 |
| `packages/server/migrations/20260624010200_add_model_relation_menu.ts` | 新增「关联关系」菜单 |
| `packages/server/src/modules/lowcode/relation.service.ts` | 关联关系业务逻辑与查询展开 |
| `packages/server/src/modules/lowcode/relation.controller.ts` | 关联关系 HTTP 控制器 |
| `packages/lowcode-admin/src/api/relation.ts` | 前端关联关系 API 封装 |
| `packages/lowcode-admin/src/views/lowcode/RelationList.vue` | 关联关系管理页面 |
| `packages/lowcode-admin/src/views/lowcode/RelationEditor.vue` | 关联关系编辑抽屉 |
| `packages/lowcode-admin/src/components/model-designer/RelationPanel.vue` | 模型设计器关联关系面板 |
| `sop/manuals/lowcode/model-relation.md` | 关联关系用户手册 |
| `sop/progress/by-phase/phase-20.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/lowcode.service.ts` | 动态 CRUD 支持 expand 参数、关联字段校验 |
| `packages/server/src/modules/lowcode/lowcode.controller.ts` | 列表/详情接口接收 expand 参数并透传 |
| `packages/server/src/modules/lowcode/lowcode.routes.ts` | 注册 `/relations` 路由 |
| `packages/server/src/modules/lowcode/field.service.ts`（如存在）或 `lowcode.service.ts` | 字段 CRUD 支持 `ref_relation`、`ref_filter` |
| `packages/server/seeds/01_init_data.ts` | 新增「关联关系」菜单与权限码 |
| `packages/lowcode-admin/src/router/index.ts` | 注册关联关系页面路由 |
| `packages/lowcode-admin/src/views/lowcode/ModelDesigner.vue` | 新增关联关系 Tab、字段配置支持关联类型 |
| `packages/lowcode-admin/src/views/lowcode/LowcodePage.vue` | 动态表单/表格根据关联字段调用 expand 接口 |
| `packages/lowcode-admin/src/components/dynamic-form/...` | 表单控件渲染关联字段下拉 |
| `packages/lowcode-admin/src/components/crud-table/...` | 表格列展示关联字段 |
| `packages/lowcode-admin/src/views/lowcode/FormDesigner.vue` | 关联字段设计时预览 |
| `packages/lowcode-admin/src/views/lowcode/TableDesigner.vue` | 列配置支持关联字段显示 |
| `AGENTS.md` | 补充关联关系到低代码能力说明 |
| `sop/lowcode/metadata.md` | 补充关联关系元数据说明 |
| `sop/lowcode/dynamic-api.md` | 补充 expand 参数说明 |

## 任务清单

- [x] 数据库迁移：创建 `lowcode_model_relations` 表、扩展 `lowcode_fields`、新增菜单
- [x] 后端：关联关系 CRUD API
- [x] 后端：动态 CRUD 查询支持 `expand` 与关联数据展开
- [x] 后端：动态 CRUD 保存/更新校验关联字段值
- [x] 后端：关联可选数据接口 `/relations/:code/options`
- [x] 前端：关联关系 API 封装
- [x] 前端：关联关系列表与编辑页面
- [x] 前端：模型设计器新增关联关系 Tab
- [x] 前端：字段配置支持选择关联关系
- [x] 前端：动态表单渲染关联字段下拉选择
- [x] 前端：CRUD 表格列展示关联字段
- [x] 前端：表单/列表设计器支持关联字段配置
- [x] 文档：编写关联关系用户手册与阶段进度文档
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 管理员可在模型设计器中创建 `belongsTo` / `hasMany` / `manyToMany` 关系。
2. [x] 字段配置选择关联关系后，低代码运行页表单中该字段以下拉选择形式展示目标模型数据。
3. [x] 列表页可通过配置显示关联字段（如订单列表显示客户名称）。
4. [x] 调用 `/api/lowcode/order?expand=customer_id` 返回的数据包含嵌套关联对象。
5. [x] 保存数据时若关联字段值不存在于目标模型，后端返回 400 错误。
6. [x] 数据权限对关联查询同时生效：用户只能看到自己有权限的源模型和目标模型数据。
7. [x] 未配置关联关系的模型接口行为与现有保持一致。
8. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **性能**：`hasMany` 展开采用应用层二次查询，数据量大时可能产生 N+1 问题；后续可改为 JSON 聚合或分页加载。
2. **中间表**：`manyToMany` 的中间表目前需要手动创建并配置，后续可支持自动生成。
3. **循环关联**：模型 A 关联 B、B 又关联 A 时，expand 需限制递归深度，本期只支持一层展开。
4. **字段删除**：若字段被关系引用，删除字段前需校验并提示；本期先在前端做校验。
