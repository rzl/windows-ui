# 阶段七（子项）：工作流引擎与业务模型打通

## 目标

把已独立实现的工作流引擎（`flow` 模块）与低代码业务模型真正串联起来：
1. 低代码模型可绑定流程定义；
2. 业务数据新增后自动启动流程实例；
3. 审批人可在待办中查看业务数据并审批/驳回；
4. 流程轨迹（节点、审批人、意见、时间）可查询。

## 功能清单

### 流程定义
- 流程编码、名称、关联模型、状态、节点与连线配置
- 节点类型：开始、审批、会签、抄送、条件、结束
- 审批人支持按角色 / 用户 / 部门指定
- 会签支持 `all`（全部通过）与 `any`（一人通过）
- 条件节点支持 `form.xxx > 1000` 类表达式

### 流程实例
- 低代码数据新增后自动调用 `flowService.startFlowInstance`
- 流程启动时记录启动人、业务数据快照
- 流程状态：`running` / `completed` / `rejected`

### 任务处理
- 我的待办：按当前用户的角色/用户/部门筛选 pending 任务
- 审批通过 / 驳回，支持填写审批意见
- 任务处理记录操作人

### 流程轨迹
- 查询指定业务主键（business_key）关联的全部任务记录
- 展示节点名称、处理人、状态、意见、时间

## 数据表

| 表名 | 说明 |
|------|------|
| flow_definitions | 流程定义 |
| flow_instances | 流程实例 |
| flow_tasks | 流程任务（含 pending / approved / rejected / cc） |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /flow/definitions | 流程定义列表 |
| GET | /flow/definitions/:code | 流程定义详情 |
| GET | /flow/definitions/model/:modelCode | 按模型获取流程定义 |
| POST | /flow/definitions | 保存流程定义 |
| DELETE | /flow/definitions/:id | 删除流程定义 |
| POST | /flow/instances/start | 手动启动流程实例 |
| GET | /flow/instances/status/:businessKey | 查询业务主键流程状态 |
| GET | /flow/instances/trace/:businessKey | 查询流程轨迹 |
| GET | /flow/tasks/pending | 我的待办 |
| POST | /flow/tasks/:id/approve | 审批通过 |
| POST | /flow/tasks/:id/reject | 审批驳回 |

## 与低代码集成点

- `lowcode.service.dynamicCreate` 在写入业务数据后，若模型存在启用的流程定义，自动启动流程。
- `lowcode.service.dynamicList` 在返回列表时，附加每条记录的 `__flow_status` / `__flow_task_id`。
- 前端 `LowcodePage` 根据 `__flow_status` 控制编辑/删除按钮：审批中不可编辑，已驳回可重新编辑。

## 任务清单

- [x] 流程定义表、实例表、任务表迁移
- [x] 后端流程定义 CRUD API
- [x] 后端流程启动、审批、驳回 API
- [x] 后端会签、抄送、条件节点支持
- [x] 后端我的待办查询（按角色/用户/部门）
- [x] 低代码创建数据自动启动流程
- [x] 低代码列表附加流程状态
- [x] 前端流程设计器（基于 @vue-flow/core）
- [x] 前端流程定义列表
- [x] 前端我的待办列表
- [x] 前端审批页面展示业务数据详情
- [x] 后端流程轨迹查询 API
- [x] 任务处理记录操作人

## 验收标准

- 可在模型上配置流程并启用；
- 提交业务数据后，流程自动进入审批人待办；
- 审批人能查看业务数据并审批/驳回；
- 审批中业务数据不可编辑，驳回后可重新编辑；
- 可查询任意业务记录的流程轨迹；
- `pnpm build:server` 与 `pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-14：流程模块基础实现完成，包含节点/连线/会签/条件；
- 2026-06-14：低代码动态创建自动启动流程，列表附加 `__flow_status`；
- 2026-06-14：前端 `FlowList` / `PendingTaskList` / `FlowDesigner` 联调通过。
