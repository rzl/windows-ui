# 阶段七（子项）：数据权限与审计字段

## 目标

在低代码模型层面补齐数据权限控制与审计字段，使业务数据满足基本的企业级合规要求。

## 功能清单

### 数据权限
- 模型维度配置：全部可见 / 仅本人 / 本部门 / 本部门及子部门 / 不可见
- 列表查询自动按当前用户角色/部门过滤
- 管理员（roleId === 1 或拥有 `*` 权限）不受限制

### 审计字段
- `create_by`：创建人用户 ID，数据新增时自动写入
- `dept_id`：创建人部门 ID，数据新增时自动写入
- `update_by`：最后修改人用户 ID，数据更新时自动写入
- `create_time` / `update_time`：创建/更新时间，由数据库默认值维护

### 操作日志增强
- 请求日志中间件已记录全部 API 请求到 `operation_logs`
- 动态 CRUD 请求通过路径区分具体模型

## 数据表

- `lowcode_models.data_permission`：模型数据权限策略
- 各动态物理表：`create_by`、`dept_id`、`update_by`、`create_time`、`update_time`

## 集成点

- `lowcode.service.createModel` 创建物理表时即包含 `create_by`、`dept_id`、`create_time`、`update_time`。
- `lowcode.service.dynamicCreate` 写入 `create_by` / `dept_id`。
- `lowcode.service.dynamicUpdate` 写入 `update_by` / `update_time`。
- `lowcode.service.dynamicList` 调用 `applyDataPermission` 拼接过滤条件。

## 任务清单

- [x] 模型表增加 `data_permission` 字段迁移
- [x] 动态物理表增加 `create_by`、`dept_id` 迁移
- [x] 后端列表查询按数据权限过滤
- [x] 后端新增数据写入创建人/部门
- [x] 后端更新数据写入修改人
- [x] 前端模型编辑支持选择数据权限策略
- [x] 请求日志中间件记录操作日志

## 验收标准

- 普通用户只能看到权限范围内的数据；
- 数据新增/更新后审计字段自动填充；
- 管理员可查看全部数据；
- `pnpm build:server` 与 `pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-14：完成数据权限字段与审计字段迁移；
- 2026-06-14：后端动态 CRUD 集成数据权限与审计字段写入。
