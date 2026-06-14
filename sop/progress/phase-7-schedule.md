# 阶段七（子项）：定时任务调度

## 目标

实现基于 `node-cron` 的可配置定时任务，支持 SQL / 脚本 / 内部接口三种处理器，并提供执行日志与手动执行能力。

## 功能清单

### 任务管理
- 任务编码、名称、CRON 表达式、处理器类型、处理器配置、状态
- 新增、编辑、删除、启用/禁用
- 手动触发执行

### 处理器类型
| 类型 | 说明 |
|------|------|
| sql | 执行 SELECT，通过仪表盘数据源能力返回结果 |
| script | 在线 JavaScript，直接返回结果 |
| api | 调用内部 API，通过仪表盘数据源能力返回结果 |

### 调度执行
- 服务启动时加载所有启用任务
- 任务保存/状态变更后重载单个任务
- 支持秒级/分钟级/小时级/天级等标准 CRON 表达式

### 执行日志
- 记录每次执行时间、状态（success / error）、结果
- 每个任务最近 50 条日志

## 数据表

| 表名 | 说明 |
|------|------|
| scheduled_tasks | 定时任务定义 |
| scheduled_task_logs | 执行日志 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /schedule/tasks | 任务列表 |
| GET | /schedule/tasks/:id | 任务详情 |
| POST | /schedule/tasks | 新增任务 |
| PUT | /schedule/tasks/:id | 更新任务 |
| DELETE | /schedule/tasks/:id | 删除任务 |
| GET | /schedule/tasks/:id/logs | 执行日志 |
| POST | /schedule/tasks/:id/run | 手动执行 |

## 任务清单

- [x] 创建 `scheduled_tasks` / `scheduled_task_logs` 迁移
- [x] 后端任务 CRUD API
- [x] 后端手动执行 API
- [x] 后端调度器（启动时加载、按任务重载）
- [x] 前端任务列表页面
- [x] 前端任务编辑弹窗（CRON、处理器类型与配置）
- [x] 前端执行日志弹窗
- [x] 保存任务后自动重载调度器

## 验收标准

- 可新增启用状态的定时任务；
- 到达 CRON 时间后自动执行并记录日志；
- 可手动触发执行并查看结果；
- 禁用任务后不再自动执行；
- `pnpm build:server` 与 `pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-14：完成定时任务表迁移与后端 API；
- 2026-06-14：完成 `ScheduleList` 前端页面与调度器重载联调。
