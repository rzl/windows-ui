# 阶段三十二：工作流高级特性

## 目标

在 phase-31 工作流增强基础上，补充企业审批场景的高级能力：节点超时自动流转、流程催办、流程实例强制终止。

## 功能清单

### 1. 节点超时自动流转

- 审批节点支持配置 `timeoutAction`：
  - `none`：仅提醒（默认）
  - `autoApprove`：超时后自动通过
  - `autoReject`：超时后自动驳回
- `timeoutHours` 为 0 或 `timeoutAction` 为 `none` 时不自动流转。
- 超时扫描任务检测到超时时，根据节点配置执行自动审批/驳回。
- 自动流转记录操作人名称为「系统自动」，并附带超时说明。

### 2. 流程催办

- 发起人或管理员可对进行中的流程实例发起催办。
- 催办时向当前待办任务的所有审批人发送站内消息与 WebSocket 推送。
- 记录催办次数与上次催办时间，避免过度催办。
- 前端「我的待办」和流程轨迹中支持对当前任务催办。

### 3. 流程实例强制终止

- 管理员可强制终止进行中的流程实例。
- 终止时填写原因，实例状态变为 `terminated`。
- 被终止实例对应的业务数据可恢复编辑。
- 流程轨迹显示终止记录。

## 数据表

### flow_instances（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| terminated_by | int | 强制终止人 ID |
| terminated_reason | text | 强制终止原因 |
| terminated_time | timestamp | 强制终止时间 |

### flow_tasks（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| urge_count | int | 催办次数 |
| last_urge_time | timestamp | 上次催办时间 |

## 接口约定

### 催办

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/flow/tasks/:id/urge | 催办指定任务 |
| POST | /api/flow/instances/:id/urge | 按实例催办当前待办 |

### 强制终止

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/flow/instances/:id/terminate | 强制终止流程实例 |

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260702030000_flow_advanced_features.ts` | 高级特性字段迁移 |
| `sop/progress/by-phase/phase-32.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/flow/flow.service.ts` | 超时自动流转、催办、强制终止 |
| `packages/server/src/modules/flow/flow.controller.ts` | 新增接口控制器 |
| `packages/server/src/modules/flow/flow.routes.ts` | 注册新路由 |
| `packages/lowcode-admin/src/api/flow.ts` | 新增 API 封装 |
| `packages/lowcode-admin/src/views/flow/PendingTaskList.vue` | 催办按钮 |
| `packages/lowcode-admin/src/views/flow/FlowList.vue` | 强制终止入口（按实例） |
| `packages/lowcode-admin/src/components/flow-designer/FlowDesigner.vue` | 节点超时动作配置 |
| `sop/progress/README.md` | 添加 phase-32 |
| `sop/progress/by-feature/workflow/README.md` | 更新子线状态 |
| `sop/manuals/lowcode/flow.md` | 更新用户手册 |
| `sop/manuals/flow/pending-task.md` | 更新用户手册 |
| `sop/database/schema.md` | 更新表结构 |

## 任务清单

- [x] 数据库迁移：flow_instances 终止字段、flow_tasks 催办字段
- [x] 后端：节点超时自动流转（autoApprove / autoReject / none）
- [x] 后端：流程催办接口与消息推送
- [x] 后端：流程实例强制终止接口
- [x] 前端：流程设计器节点支持配置超时动作
- [x] 前端：我的待办支持催办
- [x] 前端：流程实例支持强制终止
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 审批节点可配置超时自动通过 / 自动驳回 / 仅提醒。
2. [x] 超时后按配置自动流转，流程轨迹显示系统自动处理记录。
3. [x] 可对进行中的流程任务发起催办，审批人收到站内消息。
4. [x] 管理员可强制终止流程实例，流程状态变为 terminated。
5. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-07-02：完成后端接口、前端页面与流程设计器配置，同步 SOP 文档，`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 验证通过。

## 风险与待决策

1. **自动流转安全性**：autoApprove / autoReject 可能影响业务合规性，需在文档中明确提示。
2. **催办频率**：当前仅记录次数与时间，未做强制频率限制，后续可配置最小催办间隔。
3. **终止后业务数据**：强制终止后业务数据可编辑，但已产生的业务影响需用户自行处理。
