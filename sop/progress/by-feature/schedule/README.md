# 主功能：定时任务调度

## 目标

提供基于 CRON 表达式的可配置定时任务，支持多种处理器和执行日志。

## 子线清单

| 子线 | 阶段 | 内容 | 状态 |
|------|------|------|------|
| 任务管理 | [phase-7（schedule）](../../by-phase/phase-7-schedule.md) | 任务 CRUD、启用/禁用 | ✅ |
| 调度执行 | [phase-7（schedule）](../../by-phase/phase-7-schedule.md) | 服务启动加载、按任务重载 | ✅ |
| 执行日志 | [phase-7（schedule）](../../by-phase/phase-7-schedule.md) | 记录每次执行结果 | ✅ |

## 待增强

- [ ] 任务执行失败告警
- [ ] 任务执行超时配置
- [ ] 任务依赖编排
