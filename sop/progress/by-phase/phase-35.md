# 阶段三十五：剩余业务模块租户隔离补齐

## 目标

将多租户隔离从阶段三十四的核心系统表，扩展到所有剩余业务模块：低代码元数据、工作流、监控日志、消息通知、自定义接口、插件、报表打印、定时任务、外部数据源、数据治理、数据/字段权限以及低代码动态物理表，确保普通用户只能访问本租户数据，超级管理员可跨租户管理。

## 功能清单

### 1. 低代码元数据隔离

为以下低代码元数据表增加 `tenant_id` 并在 service/controller 中附加过滤：

- `lowcode_models`：模型定义（code、table_name 改为 `(tenant_id, code)` / `(tenant_id, table_name)` 联合唯一）
- `lowcode_fields`：模型字段（联合唯一改为 `(tenant_id, model_id, field_name)`）
- `lowcode_forms`：表单配置
- `lowcode_tables`：列表配置
- `lowcode_model_relations`：模型关联关系（code 改为 `(tenant_id, code)` 联合唯一）
- `lowcode_model_versions`：模型版本快照
- `lowcode_coding_rules`：编码规则
- `lowcode_validation_rules`：校验规则
- `lowcode_saved_queries`：保存查询

### 2. 自定义接口与版本隔离

- `lowcode_custom_apis`：自定义接口定义（code、path 改为 `(tenant_id, code)` / `(tenant_id, path)`）
- `lowcode_custom_api_versions`：自定义接口版本
- `custom_api_logs`：自定义接口执行日志

### 3. 工作流隔离

- `flow_definitions`：流程定义（联合唯一改为 `(tenant_id, code, version)`）
- `flow_instances`：流程实例
- `flow_tasks`：流程任务
- `flow_delegations`：流程委托

### 4. 监控与日志隔离

- `operation_logs`：操作日志
- `data_logs`：数据变更日志
- `data_audit_logs`：数据审计日志
- `api_metrics`：API 性能指标
- `sql_metrics`：慢 SQL 指标
- `alert_rules`：告警规则
- `alert_records`：告警记录
- `data_retention_policies`：数据保留策略

### 5. 消息中心隔离

- `message_templates`：消息模板（code 改为 `(tenant_id, code)` 联合唯一）
- `messages`：消息记录

### 6. 首页与仪表盘隔离

- `homepage_configs`：首页配置（code 改为 `(tenant_id, code)` 联合唯一）
- `dashboards`：仪表盘定义（code 改为 `(tenant_id, code)` 联合唯一）

### 7. 插件、报表、打印、定时任务、外部数据源隔离

- `lowcode_plugins`：插件定义（code 改为 `(tenant_id, code)` 联合唯一）
- `print_templates`：打印模板
- `lowcode_reports`：报表定义
- `scheduled_tasks`：定时任务
- `scheduled_task_logs`：定时任务日志
- `external_data_sources`：外部数据源

### 8. 数据权限与字段权限隔离

- `lowcode_data_permission_rules`：数据权限规则（code 改为 `(tenant_id, code)` 联合唯一）
- `role_data_permissions`：角色数据权限绑定（联合唯一改为 `(tenant_id, role_id, data_permission_id)`）
- `lowcode_field_permission_rules`：字段权限规则（联合唯一改为 `(tenant_id, model_code, field_code)`）

### 9. 动态物理表隔离

- 所有低代码模型生成的动态物理表统一补充 `tenant_id` 列。
- 动态表查询、新增、更新、删除均按当前租户过滤。
- 新增模型时，自动创建的物理表包含 `tenant_id` 字段。

## 数据表

### 新增 tenant_id 的业务元数据表

| 表 | 说明 |
|----|------|
| `lowcode_models` | 低代码数据模型 |
| `lowcode_fields` | 模型字段 |
| `lowcode_forms` | 表单配置 |
| `lowcode_tables` | 列表配置 |
| `lowcode_model_relations` | 模型关联关系 |
| `lowcode_model_versions` | 模型版本快照 |
| `lowcode_coding_rules` | 编码规则 |
| `lowcode_validation_rules` | 校验规则 |
| `lowcode_saved_queries` | 保存查询 |
| `lowcode_custom_apis` | 自定义接口 |
| `lowcode_custom_api_versions` | 自定义接口版本 |
| `custom_api_logs` | 自定义接口执行日志 |
| `flow_definitions` | 流程定义 |
| `flow_instances` | 流程实例 |
| `flow_tasks` | 流程任务 |
| `flow_delegations` | 流程委托 |
| `message_templates` | 消息模板 |
| `messages` | 消息记录 |
| `operation_logs` | 操作日志 |
| `data_logs` | 数据变更日志 |
| `data_audit_logs` | 数据审计日志 |
| `api_metrics` | API 性能指标 |
| `sql_metrics` | 慢 SQL 指标 |
| `alert_rules` | 告警规则 |
| `alert_records` | 告警记录 |
| `data_retention_policies` | 数据保留策略 |
| `homepage_configs` | 首页配置 |
| `dashboards` | 仪表盘定义 |
| `lowcode_plugins` | 插件定义 |
| `print_templates` | 打印模板 |
| `lowcode_reports` | 报表定义 |
| `scheduled_tasks` | 定时任务 |
| `scheduled_task_logs` | 定时任务日志 |
| `external_data_sources` | 外部数据源 |
| `lowcode_data_permission_rules` | 数据权限规则 |
| `role_data_permissions` | 角色数据权限绑定 |
| `lowcode_field_permission_rules` | 字段权限规则 |
| `export_tasks` | 异步导出任务 |

### 动态物理表

所有由 `lowcode_models` 生成的物理表均新增 `tenant_id` 列，并在 CRUD 中按租户隔离。

## 新增/修改文件

### 迁移

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260702050200_add_tenant_id_to_remaining_tables.ts` | 剩余业务表 tenant_id 迁移与唯一索引调整 |

### 后端 service/controller

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/lowcode.service.ts` | 低代码元数据与动态 CRUD 全量租户隔离 |
| `packages/server/src/modules/lowcode/lowcode.controller.ts` | 全部接口改用 `AuthRequest` 并透传 `req` |
| `packages/server/src/modules/lowcode/relation.service.ts` | 关联关系与 expand 查询租户隔离 |
| `packages/server/src/modules/lowcode/data-permission.service.ts` | 数据权限规则租户隔离 |
| `packages/server/src/modules/lowcode/field-permission.service.ts` | 字段权限规则租户隔离 |
| `packages/server/src/modules/lowcode/model-version.service.ts` | 模型版本租户隔离 |
| `packages/server/src/modules/lowcode/model-import-export.service.ts` | 模型导入导出租户隔离 |
| `packages/server/src/modules/flow/flow.service.ts` / `flow.controller.ts` | 流程定义、实例、任务、委托租户隔离 |
| `packages/server/src/modules/custom-api/custom-api.service.ts` / `custom-api.controller.ts` | 自定义接口租户隔离 |
| `packages/server/src/modules/custom-api/custom-api-security.service.ts` / `custom-api-version.service.ts` / `custom-api-version.controller.ts` | 自定义接口安全、版本、日志租户隔离 |
| `packages/server/src/modules/dashboard/dashboard.service.ts` / `dashboard.controller.ts` | 首页配置与仪表盘租户隔离 |
| `packages/server/src/modules/system/system.service.ts` / `system.controller.ts` | 字典、公告、职务租户隔离 |
| `packages/server/src/modules/monitor/monitor.service.ts` / `monitor.controller.ts` | 监控指标、告警、日志治理租户隔离 |
| `packages/server/src/modules/alert/alert.service.ts` | 告警规则与记录租户隔离 |
| `packages/server/src/modules/data-governance/data-governance.service.ts` | 数据保留策略租户隔离 |
| `packages/server/src/modules/audit/audit.service.ts` | 审计日志租户隔离 |
| `packages/server/src/modules/report/report.service.ts` | 报表数据源按租户隔离 |
| `packages/server/src/modules/print/print.service.ts` | 打印模板与渲染数据按租户隔离 |
| `packages/server/src/modules/schedule/schedule.service.ts` / `schedule.controller.ts` | 定时任务与日志租户隔离 |
| `packages/server/src/modules/external-datasource/external-datasource.service.ts` / `external-datasource.controller.ts` | 外部数据源租户隔离 |
| `packages/server/src/modules/plugin/plugin.service.ts` / `plugin.controller.ts` | 插件租户隔离 |
| `packages/server/src/modules/rbac/rbac.service.ts` / `rbac.controller.ts` | 用户/角色/部门/菜单租户隔离 |
| `packages/server/src/modules/auth/auth.service.ts` | 登录按租户匹配、JWT 携带 tenantId、DTO 类型导入修复 |
| `packages/server/src/middleware/requestLog.ts` | 操作日志记录 tenant_id |
| `packages/server/src/index.ts` | 启动时租户表默认数据初始化 |
| `packages/server/src/utils/tenant.ts` | 租户隔离工具函数 |

### 种子数据

| 文件 | 说明 |
|------|------|
| `packages/server/seeds/01_init_data.ts` | 为所有新增 tenant_id 的表设置默认租户，补充默认首页/仪表盘/消息模板 |

## 任务清单

- [x] 创建剩余业务表 `tenant_id` 迁移（含动态物理表补列）
- [x] 低代码元数据 service/controller 租户隔离
- [x] 自定义接口及版本、日志租户隔离
- [x] 工作流引擎租户隔离
- [x] 监控日志、数据审计、告警治理租户隔离
- [x] 消息中心租户隔离
- [x] 首页配置与仪表盘租户隔离
- [x] 插件、报表、打印、定时任务、外部数据源租户隔离
- [x] 数据权限、字段权限、角色数据权限绑定租户隔离
- [x] 动态物理表 CRUD 租户隔离
- [x] 种子数据更新
- [x] 文档：阶段进度文档与数据库设计文档
- [x] 验证：`pnpm db:migrate`、`pnpm db:seed`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 所有剩余业务元数据表均含 `tenant_id` 字段并按租户过滤。
2. [x] 低代码动态物理表新增/查询/更新/删除均按租户隔离。
3. [x] 超级管理员可查看所有租户数据，普通用户仅查看本租户数据。
4. [x] 编码规则、自定义接口、流程定义、消息模板、首页配置、仪表盘、插件等 code 类字段按租户联合唯一。
5. [x] 模型导入导出、模型版本回滚、报表打印、异步导出等跨模块操作保持租户一致性。
6. [x] `pnpm db:migrate`、`pnpm db:seed`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-07-02：完成剩余全部业务模块租户隔离，同步 SOP 文档，构建与迁移验证通过。

## 风险与待决策

1. **唯一索引兼容**：本次将大量 code 字段从单表唯一改为 `(tenant_id, code)` 联合唯一，现有重复编码数据需提前清理。
2. **动态表默认 tenant_id**：历史动态物理表通过迁移补充 `tenant_id` 并默认填充 `1`（默认租户），后续新建数据按当前租户写入。
3. **超级管理员数据归属**：超级管理员写入的元数据 `tenant_id` 按 `utils/tenant.ts` 规则处理；动态表写入时取 `req.user.tenantId`。
