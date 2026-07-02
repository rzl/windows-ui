# 阶段三十四：多租户基础框架与核心系统表隔离

## 目标

为低代码平台引入多租户能力：建立租户模型，通过 JWT + 请求头传递当前租户，对核心系统表进行行级隔离；超级管理员可跨租户管理，普通用户只能访问本租户数据。

> 本次 phase 聚焦「基础框架 + 核心系统表」，工作流、监控日志、消息通知、报表打印、低代码业务动态表等模块的租户隔离在后续 phase 补齐。

## 功能清单

### 1. 租户模型

- 新增 `tenants` 表：id、name、code、description、status。
- 新增租户管理页面，仅超级管理员可操作。
- 种子数据默认创建「默认租户」（code = `default`）。

### 2. 租户识别

- 登录接口增加可选 `tenantCode` 字段。
- 根据用户名 + 租户编码匹配用户；超级管理员可留空。
- 登录成功后 JWT payload 携带 `tenantId`。
- `authMiddleware` 解析 JWT 并将 `tenantId` 注入 `req.user`。
- 前端请求拦截器从 `authStore.userInfo.tenantId` 读取并附加 `X-Tenant-Id` 请求头。

### 3. 租户隔离工具

- 新增 `utils/tenant.ts`：
  - `isSuperAdmin(user)`：判断是否为超级管理员。
  - `getTenantId(req)`：获取应隔离的租户 ID，超管返回 `null`。
  - `tenantWhere(req)`：返回 `{ tenant_id: N }` 或空对象。
  - `setTenantId(data, req)`：为写入数据设置 `tenant_id`。

### 4. 核心系统表隔离

为以下表增加 `tenant_id` 字段，并在 service 层所有查询/插入/更新中附加过滤：

- `users`：联合唯一索引 `(tenant_id, username)`。
- `roles`、`depts`、`menus`
- `dicts`、`dict_items`
- `role_permissions`、`role_apps`
- `lowcode_apps`、`lowcode_app_items`、`lowcode_app_versions`
- `lowcode_pages`

### 5. 应用菜单隔离

- 应用发布菜单时，根菜单与子菜单均继承当前租户。
- 页面权限码优先使用页面自定义权限码，菜单同步该权限码。

## 数据表

### tenants（租户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| name | string | 租户名称 |
| code | string UNIQUE | 租户编码 |
| description | text | 描述 |
| status | integer | 0 禁用 / 1 启用 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 核心表新增字段

| 表 | 新增字段 |
|----|----------|
| users / roles / depts / menus / dicts / dict_items / role_permissions / role_apps / lowcode_apps / lowcode_app_items / lowcode_app_versions / lowcode_pages | tenant_id |

## 接口约定

### 租户管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/system/tenants | 列出所有租户 |
| GET | /api/system/tenants/:id | 获取租户详情 |
| POST | /api/system/tenants | 创建租户（超管） |
| PUT | /api/system/tenants/:id | 更新租户（超管） |
| DELETE | /api/system/tenants/:id | 删除租户（超管，默认租户不可删） |

### 登录

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 增加 `tenantCode` 字段 |

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260702050000_create_tenants_table.ts` | 租户表迁移 |
| `packages/server/migrations/20260702050100_add_tenant_id_to_core_tables.ts` | 核心表 tenant_id 迁移 |
| `packages/server/src/utils/tenant.ts` | 租户隔离工具 |
| `packages/server/src/modules/system/tenant.service.ts` | 租户 CRUD |
| `packages/server/src/modules/system/tenant.controller.ts` | 租户 HTTP 控制器 |
| `packages/server/src/modules/system/tenant.routes.ts` | 租户路由 |
| `packages/lowcode-admin/src/views/system/TenantList.vue` | 租户管理页面 |
| `sop/progress/by-phase/phase-34.md` | 本阶段文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/auth/auth.dto.ts` | loginSchema 增加 tenantCode |
| `packages/server/src/modules/auth/auth.service.ts` | 登录按租户匹配，JWT 携带 tenantId |
| `packages/server/src/middleware/auth.ts` | req.user 增加 tenantId |
| `packages/server/src/modules/rbac/rbac.service.ts` / `rbac.controller.ts` | users/roles/depts/menus 租户隔离 |
| `packages/server/src/modules/system/system.service.ts` / `system.controller.ts` | dicts/dict_items 租户隔离 |
| `packages/server/src/modules/app/app.service.ts` / `app.controller.ts` | lowcode_apps 等租户隔离 |
| `packages/server/src/modules/app/template.service.ts` | 模板安装时为核心表设置 tenant_id |
| `packages/server/src/modules/page/page.service.ts` / `page.controller.ts` | lowcode_pages 租户隔离 |
| `packages/server/src/modules/system/system.routes.ts` | 注册租户路由 |
| `packages/server/seeds/01_init_data.ts` | 默认租户与 tenant_id 初始化 |
| `packages/lowcode-admin/src/views/login/Login.vue` | 登录表单增加租户编码 |
| `packages/lowcode-admin/src/api/auth.ts` | LoginForm 增加 tenantCode |
| `packages/lowcode-admin/src/api/request.ts` | 请求头附加 X-Tenant-Id |
| `packages/lowcode-admin/src/stores/auth.ts` | userInfo 增加 tenantId |
| `packages/lowcode-admin/src/router/index.ts` | 注册 /system/tenant 路由 |
| `sop/progress/README.md` | 添加 phase-34 |
| `sop/progress/by-feature/foundation/README.md` | 更新子线状态 |
| `sop/database/schema.md` | 更新 tenants 及核心表字段 |

## 任务清单

- [x] 创建 `tenants` 表迁移
- [x] 为核心系统表增加 `tenant_id` 迁移
- [x] 新增 `utils/tenant.ts` 租户工具
- [x] 后端登录支持 `tenantCode` 并写入 JWT
- [x] 后端 `authMiddleware` 注入 `tenantId`
- [x] 后端核心 system/rbac/app/page service 增加租户过滤
- [x] 后端新增租户管理 CRUD 接口
- [x] 前端登录页增加租户编码输入
- [x] 前端请求头附加 `X-Tenant-Id`
- [x] 前端新增租户管理页面
- [x] 更新种子数据，默认租户归属
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm db:seed`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 可新增/编辑/禁用租户。
2. [x] 登录时选择租户编码，错误提示清晰。
3. [x] 普通用户只能看到本租户的用户、角色、部门、菜单、字典、应用、页面。
4. [x] 超级管理员可看到所有租户数据。
5. [x] 后端所有核心表查询均带 `tenant_id` 过滤。
6. [x] 应用发布后自动生成的菜单归属当前租户。
7. [x] `pnpm db:migrate`、`pnpm db:seed`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-07-02：完成租户基础框架、核心系统表隔离、前后端登录/请求头改造、租户管理页面，同步 SOP 文档，构建与迁移验证通过。

## 风险与待决策

1. **用户名跨租户重复**：users 表已调整为 `(tenant_id, username)` 联合唯一。
2. **超级管理员判定**：当前以 `roleId === 1` 作为超管标识，后续可增加 `is_super_admin` 字段。
3. **后续模块迁移**：工作流、监控、消息、报表、低代码业务动态表等需在后续 phase 逐个加 `tenant_id` 并改造 service。
