# 阶段三十一：工作流增强

## 目标

在低代码平台现有流程引擎基础上，补充企业审批场景中的高频能力：流程委托、流程转办、节点超时提醒、流程版本管理与流程绩效统计。

## 功能清单

### 1. 流程委托

- 用户可设置将自己的待办任务委托给他人处理。
- 支持按流程编码限定委托范围，不填则委托全部流程。
- 支持设置委托起止时间，过期自动失效。
- 委托期间，受托人可在「我的待办」中查看到委托人的待办任务。
- 任务处理记录中标记 `delegated_from`，流程轨迹显示实际处理人与委托关系。

### 2. 流程转办

- 审批人可将单条待办任务转交给其他用户处理。
- 转办后更新任务的 `assignee_type` / `assignee_value`，并记录 `transferred_from`。
- 流程轨迹显示转办记录。
- 转办仅影响当前任务，不修改流程定义。

### 3. 节点超时提醒

- 流程节点支持配置 `timeout_hours`（超时小时数），0 表示不超时。
- 任务进入节点时计算 `due_time`。
- 后端定时扫描超时任务，向审批人发送站内消息与 WebSocket 提醒。
- 任务表中 `timeout_notified` 标记避免重复提醒。

### 4. 流程版本管理

- `flow_definitions` 增加 `version`、`is_latest`、`remark` 字段。
- `code` 不再全局唯一，改为 `code + version` 唯一。
- 保存流程定义时，可选择「覆盖最新版本」或「创建新版本」。
- `flow_instances` 记录启动时的 `definition_version`，已启动实例按原版本运行。
- 前端流程列表展示版本号，支持查看历史版本与回滚。

### 5. 流程绩效统计

- 统计维度：流程定义、流程实例、任务节点。
- 指标：平均耗时、最大耗时、最小耗时、超时次数、完成数、驳回数。
- 支持按时间范围筛选。
- 前端新增「流程绩效」页面，展示概览卡片与排行榜。

## 数据表

### flow_definitions（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| version | int | 版本号，默认 1 |
| is_latest | tinyint | 是否为最新版本 |
| remark | varchar(255) | 版本说明 |

### flow_instances（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| definition_version | int | 启动时流程定义版本 |

### flow_tasks（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| timeout_hours | int | 节点超时小时数 |
| due_time | timestamp | 任务截止时间 |
| timeout_notified | tinyint | 是否已触发超时提醒 |
| transferred_from | int | 转办来源用户 ID |
| delegated_from | int | 委托来源用户 ID |

### flow_delegations（新增）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| delegator_id | int | 委托人 ID |
| delegatee_id | int | 受托人 ID |
| flow_code | varchar(50) | 限定流程编码，空表示全部 |
| start_time | timestamp | 委托开始时间 |
| end_time | timestamp | 委托结束时间 |
| status | tinyint | 1 启用 / 0 禁用 |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

## 接口约定

### 流程委托

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/flow/delegations | 查询委托列表 |
| POST | /api/flow/delegations | 创建委托 |
| PUT | /api/flow/delegations/:id | 更新委托 |
| DELETE | /api/flow/delegations/:id | 删除委托 |

### 任务处理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/flow/tasks/:id/transfer | 转办任务 |

### 流程版本

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/flow/definitions/:code/versions | 查询历史版本 |
| POST | /api/flow/definitions/:code/rollback | 回滚到指定版本 |

### 流程绩效

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/flow/performance/definitions | 按流程定义统计 |
| GET | /api/flow/performance/nodes | 按节点统计 |

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260702020000_flow_enhancement.ts` | 工作流增强迁移 |
| `sop/progress/by-phase/phase-31.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/flow/flow.service.ts` | 委托查询、转办、超时、版本、绩效统计 |
| `packages/server/src/modules/flow/flow.controller.ts` | 新增接口控制器 |
| `packages/server/src/modules/flow/flow.routes.ts` | 注册新路由 |
| `packages/server/src/index.ts` | 启动超时任务扫描定时器 |
| `packages/lowcode-admin/src/api/flow.ts` | 新增 API 封装 |
| `packages/lowcode-admin/src/views/flow/FlowList.vue` | 版本展示、回滚 |
| `packages/lowcode-admin/src/views/flow/PendingTaskList.vue` | 转办、委托展示 |
| `packages/lowcode-admin/src/views/flow/FlowDelegation.vue` | 委托管理页面（新增路由） |
| `packages/lowcode-admin/src/views/flow/FlowPerformance.vue` | 流程绩效页面（新增路由） |
| `packages/lowcode-admin/src/router/index.ts` | 注册新页面路由 |
| `sop/progress/README.md` | 添加 phase-31 |
| `sop/progress/by-feature/workflow/README.md` | 更新子线状态 |
| `sop/manuals/flow/pending-task.md` | 更新用户手册 |
| `sop/manuals/lowcode/flow.md` | 更新用户手册 |
| `sop/database/schema.md` | 更新表结构 |

## 任务清单

- [x] 数据库迁移：流程委托、任务超时、流程版本相关表字段
- [x] 后端：流程委托 CRUD 与待办查询接入委托
- [x] 后端：流程转办接口
- [x] 后端：节点超时计算与定时提醒
- [x] 后端：流程版本保存、历史版本查询、回滚
- [x] 后端：流程绩效统计接口
- [x] 前端：流程列表版本管理与回滚
- [x] 前端：待办列表转办按钮与委托标识
- [x] 前端：委托管理页面
- [x] 前端：流程绩效页面
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 可创建流程委托，受托人在委托期间可查看委托人待办。
2. [x] 可转办单条待办，流程轨迹显示转办记录。
3. [x] 节点配置超时时间后，超时会触发消息提醒。
4. [x] 保存流程时可创建新版本，已启动实例按原版本运行。
5. [x] 可查看流程绩效统计页面。
6. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **流程版本兼容性**：新版本流程定义节点结构变化可能导致旧实例轨迹展示异常，前端展示时以实例版本为准。
2. **超时扫描性能**：任务量大时定时扫描可能影响性能，后续可改为按索引分页扫描。
3. **委托冲突**：同一委托人在同一时间段可能设置多条委托，查询时按最新一条生效。
