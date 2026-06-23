# 子线：流程实例

## 来源阶段

[phase-7（子项）：工作流引擎与业务模型打通](../../by-phase/phase-7-flow.md)

## 目标

业务数据新增后，若模型存在启用的流程定义，自动启动流程实例。

## 关键实现

- `flow_instances` 表
- 低代码 `dynamicCreate` 后自动调用 `flowService.startFlowInstance`
- 低代码列表附加 `__flow_status` / `__flow_task_id`

## 验收标准

- [x] 提交业务数据后流程自动进入审批人待办
- [x] 审批中业务数据不可编辑，驳回后可重新编辑
