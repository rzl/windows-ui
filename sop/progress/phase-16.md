# 阶段十六：数据权限与行级隔离

## 目标

在低代码平台现有 RBAC 角色权限、应用授权、按钮级权限基础上，补齐**数据行级权限**与**字段级权限**，使不同角色/部门/用户在同一业务应用中只能看到自己有权限的数据行，并对敏感字段进行读/写控制。

## 功能清单

### 1. 权限模型扩展

- **数据规则（Data Permission Rule）**：
  - 规则名称、编码、关联模型
  - 作用范围：全部数据 / 本部门 / 本部门及子部门 / 仅本人 / 指定角色 / 指定用户
  - 自定义过滤条件：支持字段 = / != / > / < / like / in 等简单表达式
- **字段规则（Field Permission Rule）**：
  - 关联模型
  - 受控字段
  - 权限：可读 / 可编辑 / 隐藏

### 2. 后端能力

- 数据规则持久化表 `lowcode_data_permission_rules`
- 字段规则持久化表 `lowcode_field_permission_rules`
- 角色与数据规则关联表 `role_data_permissions`
- 动态 CRUD 查询 (`/:modelCode`) 自动注入行级过滤条件
- 动态 CRUD 保存/更新时校验字段权限，禁止写入无权限字段
- 数据权限解析服务：根据当前用户、角色、部门生成 Knex where 条件

### 3. 前端能力

- 新增「数据权限规则」管理页面
- 新增「字段权限规则」管理页面
- 角色管理新增「数据权限」Tab，为角色绑定数据规则
- 列表设计器支持「字段权限」标识（与按钮权限并列）
- 表单/列表渲染时根据字段权限自动隐藏或禁用字段
- 数据权限对自定义页面/报表/仪表盘数据源同样生效（通过统一数据服务）

### 4. 兼容与默认行为

- 未配置数据规则时，默认放行所有数据（向后兼容）
- 未配置字段规则时，默认所有字段可读可写
- 超级管理员不受数据/字段权限限制

## 数据表

### lowcode_data_permission_rules

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| code | varchar | 规则编码 |
| name | varchar | 规则名称 |
| model_code | varchar | 关联模型编码 |
| scope | varchar | `all` / `dept` / `dept_and_sub` / `self` / `roles` / `users` |
| role_ids | json | scope=roles 时生效的角色 ID 列表 |
| user_ids | json | scope=users 时生效的用户 ID 列表 |
| custom_filter | json | 自定义过滤条件数组，如 `[{"field":"status","op":"=","value":"1"}]` |
| status | tinyint | 0 禁用 / 1 启用 |
| create_time | timestamp | 创建时间 |

### lowcode_field_permission_rules

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| model_code | varchar | 关联模型编码 |
| field_code | varchar | 字段编码 |
| readable | tinyint | 是否可读 |
| editable | tinyint | 是否可编辑 |
| hidden | tinyint | 是否完全隐藏 |
| role_ids | json | 生效角色列表，为空则对所有角色生效 |
| status | tinyint | 0 禁用 / 1 启用 |

### role_data_permissions

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| role_id | int | 角色 ID |
| data_permission_id | int | 数据规则 ID |

## 接口约定

### 数据权限规则

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/lowcode/data-permissions | 规则列表 |
| GET | /api/lowcode/data-permissions/:id | 规则详情 |
| POST | /api/lowcode/data-permissions | 创建规则 |
| PUT | /api/lowcode/data-permissions/:id | 更新规则 |
| DELETE | /api/lowcode/data-permissions/:id | 删除规则 |

### 字段权限规则

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/lowcode/field-permissions | 规则列表 |
| GET | /api/lowcode/field-permissions/:id | 规则详情 |
| POST | /api/lowcode/field-permissions | 创建规则 |
| PUT | /api/lowcode/field-permissions/:id | 更新规则 |
| DELETE | /api/lowcode/field-permissions/:id | 删除规则 |

### 角色绑定

角色 CRUD 接口扩展接收 `dataPermissionIds` 数组：

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/rbac/roles | 创建角色，接收 `dataPermissionIds` |
| PUT | /api/rbac/roles/:id | 更新角色，接收 `dataPermissionIds` |
| GET | /api/rbac/roles/:id | 返回角色详情，含 `dataPermissionIds` |

## 核心实现思路

### 行级权限过滤

1. 用户登录后，`authStore` 从 `/auth/profile` 获取 `dataPermissionIds`。
2. 后端 `dataPermission.service.ts` 根据用户角色聚合所有生效的数据规则。
3. 动态 CRUD 查询前调用 `buildDataPermissionWhere(modelCode, user)`：
   - `all`：不附加条件
   - `dept`：`where({ dept_id: user.dept_id })`
   - `dept_and_sub`：`whereIn('dept_id', [user.dept_id, ...subDeptIds])`
   - `self`：`where({ create_by: user.id })`
   - `roles` / `users`：根据配置附加
   - `custom_filter`：追加字段表达式
4. 多个规则之间取**并集**（OR），同一规则内取**交集**（AND）。

### 字段级权限过滤

1. 后端 `fieldPermission.service.ts` 根据角色聚合字段规则。
2. 动态 CRUD 查询返回数据时，对 `hidden` 字段从结果中删除。
3. 动态 CRUD 新增/更新时，校验请求体中是否包含 `editable=false` 的字段，包含则返回 403。
4. 前端 `WDynamicForm` / `WCrudTable` 根据字段权限自动隐藏或禁用字段。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260620010000_create_data_permission_tables.ts` | 数据权限相关表迁移 |
| `packages/server/src/modules/lowcode/data-permission.service.ts` | 数据规则业务逻辑与行级过滤 |
| `packages/server/src/modules/lowcode/data-permission.controller.ts` | 数据规则 HTTP 控制器 |
| `packages/server/src/modules/lowcode/field-permission.service.ts` | 字段规则业务逻辑与字段校验 |
| `packages/server/src/modules/lowcode/field-permission.controller.ts` | 字段规则 HTTP 控制器 |
| `packages/lowcode-admin/src/api/dataPermission.ts` | 数据规则 API 封装 |
| `packages/lowcode-admin/src/api/fieldPermission.ts` | 字段规则 API 封装 |
| `packages/lowcode-admin/src/views/system/DataPermissionList.vue` | 数据规则管理页面 |
| `packages/lowcode-admin/src/views/system/FieldPermissionList.vue` | 字段规则管理页面 |
| `sop/manuals/system/data-permission.md` | 数据权限用户手册 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/lowcode.routes.ts` | 注册数据/字段权限路由 |
| `packages/server/src/modules/rbac/rbac.service.ts` | 角色 CRUD 支持 `dataPermissionIds` |
| `packages/server/src/modules/auth/auth.service.ts` | `getProfile` 返回 `dataPermissionIds` |
| `packages/server/src/modules/lowcode/lowcode.service.ts` | 动态 CRUD 注入行级过滤、字段校验、隐藏字段过滤 |
| `packages/server/seeds/01_init_data.ts` | 新增「数据权限」「字段权限」菜单 |
| `packages/lowcode-admin/src/router/index.ts` | 注册数据/字段权限页面路由 |
| `packages/lowcode-admin/src/views/system/RoleList.vue` | 新增「数据权限」Tab |
| `packages/lowcode-admin/src/views/lowcode/LowcodePage.vue` | 根据字段权限隐藏/禁用表单字段与表格列 |

## 任务清单

- [x] 数据库迁移：创建数据规则、字段规则、角色数据权限关联表
- [x] 后端：数据规则 CRUD API
- [x] 后端：字段规则 CRUD API
- [x] 后端：角色服务支持绑定数据规则
- [x] 后端：`auth/profile` 返回数据规则列表
- [x] 后端：动态 CRUD 查询注入行级权限过滤
- [x] 后端：动态 CRUD 保存/更新校验字段权限
- [x] 前端：数据规则管理页面
- [x] 前端：字段规则管理页面
- [x] 前端：角色管理新增「数据权限」Tab
- [x] 前端：动态表单/CRUD 表根据字段权限渲染
- [x] 文档：编写数据权限用户手册与阶段进度文档
- [x] 验证：迁移、运行、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 管理员可创建数据权限规则并绑定到角色。
2. [x] 普通用户登录后，动态 CRUD 列表只显示有权限的数据行。
3. [x] 超级管理员可查看全部数据。
4. [x] 字段设置为隐藏后，列表不展示该列，表单不显示该字段。
5. [x] 字段设置为只读后，表单显示但不可编辑。
6. [x] 接口层面禁止写入无权限字段，返回 403。
7. [x] 未配置规则时系统行为与现在保持一致。
8. [x] `pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-19：完成后端数据库迁移、数据/字段权限服务、动态 CRUD 集成。
- 2026-06-19：完成前端数据/字段权限管理页面、角色管理 Tab、LowcodePage 字段权限渲染。
- 2026-06-19：同步更新种子菜单、路由、用户手册、阶段进度文档。
- 2026-06-19：运行迁移，`pnpm build:server` 与 `pnpm build:lowcode` 验证通过。

## 风险与待决策

1. **性能**：行级权限在每条动态查询前解析规则并生成 SQL，规则较多时需加缓存（如 Redis 或内存缓存）。
2. **复杂条件**：自定义过滤条件先支持简单表达式，后续可扩展为类 `WQueryBuilder` 的可视化规则设计器。
3. **部门树**：`dept_and_sub` 需要递归查询部门树，注意部门删除/调整后的缓存刷新。
