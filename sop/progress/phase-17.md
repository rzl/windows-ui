# 阶段十七：消息通知与待办中心

## 目标

把后端已具备的消息存储/推送能力（`messages`、`message_templates`、WebSocket）与前端已存在的「消息管理」「我的待办」页面真正串联起来，在平台顶部提供统一的通知入口；让流程产生的待办任务能够自动发送消息提醒，并实现消息到业务详情/审批详情的一键跳转，形成「业务数据 → 流程待办 → 消息提醒 → 审批处理」的完整闭环。

## 功能清单

### 1. 消息元数据扩展

- `messages` 表新增字段：
  - `type`：消息类型 `todo` / `notice` / `system`
  - `business_type`：业务类型 `flow` / `lowcode` / `system`
  - `business_key`：业务主键
  - `link`：前端跳转路由
  - `sender_name`：发送人名称

### 2. 流程待办自动发消息

- 流程节点生成 `approve` / `sign` / `cc` 任务时，按审批人范围解析用户列表并发送待办消息。
- 流程审批结束（通过/驳回）后，向发起人发送结果通知。

### 3. 顶部通知中心

- `LowcodeLayout.vue` 顶部新增铃铛图标与未读角标。
- 下拉面板分「待办」「消息」「已读」三个 Tab。
- 支持一键已读、点击跳转。

### 4. 前端 WebSocket

- 登录后建立 WebSocket 连接并发送认证信息。
- 断线后 5 秒自动重连，最多重试 10 次。
- 页面可见性变化时主动重连。

### 5. 消息与待办联动

- 「我的待办」处理任务后，对应待办消息自动标为已读。
- 「消息管理」页面支持按类型/业务类型筛选与点击跳转。

### 6. 文档

- `sop/manuals/system/message-center.md`：消息中心用户手册。
- `sop/manuals/flow/pending-task.md`：流程待办与消息提醒手册。

## 数据表

### messages（扩展字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| type | varchar(20) | todo / notice / system |
| business_type | varchar(20) | flow / lowcode / system |
| business_key | varchar(50) | 业务主键 |
| link | varchar(255) | 前端跳转路由 |
| sender_name | varchar(50) | 发送人昵称 |

## 接口约定

### 新增/扩展接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/monitor/messages?type=todo&businessType=flow | 支持类型筛选的消息查询 |
| POST | /api/monitor/messages/read-all | 一键已读 |
| PUT | /api/monitor/messages/:businessType/:businessKey/read | 按业务标识标为已读 |

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260621010000_add_message_meta_fields.ts` | messages 表扩展字段迁移 |
| `packages/lowcode-admin/src/utils/websocket.ts` | 前端 WebSocket 连接管理 |
| `packages/lowcode-admin/src/components/NotificationCenter.vue` | 顶部通知中心组件 |
| `sop/manuals/system/message-center.md` | 消息中心用户手册 |
| `sop/manuals/flow/pending-task.md` | 流程待办与消息提醒手册 |
| `sop/progress/phase-17.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/flow/flow.service.ts` | 任务生成/结束时自动发送消息 |
| `packages/server/src/modules/monitor/monitor.service.ts` | 支持新字段、新增批量已读方法 |
| `packages/server/src/modules/monitor/monitor.controller.ts` | 注册新接口 |
| `packages/server/src/modules/monitor/monitor.routes.ts` | 注册新路由 |
| `packages/lowcode-admin/src/views/layout/LowcodeLayout.vue` | 集成通知中心 |
| `packages/lowcode-admin/src/App.vue` | 刷新后重新获取用户信息并建立 WebSocket |
| `packages/lowcode-admin/src/stores/auth.ts` | 登录/获取信息后初始化 WebSocket |
| `packages/lowcode-admin/src/stores/app.ts` | 未读计数状态管理 |
| `packages/lowcode-admin/src/views/monitor/MessageList.vue` | 类型筛选与点击跳转 |
| `packages/lowcode-admin/src/views/flow/PendingTaskList.vue` | 审批后同步消息已读 |
| `packages/lowcode-admin/src/api/monitor.ts` | 新增 API 封装 |

## 任务清单

- [x] 数据库迁移：messages 表新增元数据字段
- [x] 后端：monitor 服务支持新字段与扩展查询
- [x] 后端：新增 readAllMessages、markMessageReadByBusinessKey
- [x] 后端：flow 任务生成时自动发送待办消息
- [x] 后端：flow 审批结束时发送结果通知
- [x] 后端：注册新增接口路由
- [x] 前端：新增 WebSocket 连接工具
- [x] 前端：authStore 初始化/销毁 WebSocket
- [x] 前端：appStore 未读计数状态
- [x] 前端：App.vue 刷新后重连
- [x] 前端：NotificationCenter 顶部通知中心组件
- [x] 前端：LowcodeLayout 集成通知中心
- [x] 前端：MessageList 类型筛选与跳转
- [x] 前端：PendingTaskList 审批后同步已读
- [x] 文档：消息中心与流程待办手册
- [x] 验证：迁移、运行、前后端构建

## 验收标准

1. [x] 流程提交产生审批任务后，审批人立即收到 WebSocket 推送，顶部铃铛角标 +1。
2. [x] 点击铃铛下拉面板可看到最新待办与消息，点击待办可跳转「我的待办」。
3. [x] 审批人处理完任务后，对应待办消息自动标为已读，顶部角标减少。
4. [x] 发起人收到流程审批结果通知（通过/驳回）。
5. [x] 刷新页面后未读计数通过 API 重新拉取，保持准确。
6. [x] 断网 5 秒内恢复后，WebSocket 自动重连并继续接收推送。
7. [x] `pnpm build:server` 与 `pnpm build:lowcode` 无类型错误，构建成功。

## 运行记录

- 2026-06-20：完成 messages 表扩展迁移与 monitor 服务接口扩展。
- 2026-06-20：完成 flow 任务自动发送待办消息与结果通知。
- 2026-06-20：完成前端 WebSocket、通知中心组件、顶部集成、状态联动。
- 2026-06-20：完成 MessageList 增强、PendingTaskList 同步已读。
- 2026-06-20：同步更新用户手册、阶段进度文档。
- 2026-06-20：运行迁移与前后端构建验证。

## 风险与待决策

1. **批量发消息性能**：角色/部门下用户较多时，同步循环发送消息可能成为瓶颈，后续可改为批量插入 + WebSocket 批量推送。
2. **消息表增长**：随流程运行快速增长，后续需考虑归档/清理策略。
3. **实时提示粒度**：当前仅在新消息到达时显示全局提示，后续可按消息类型显示不同提示文案。
