# 子线：操作日志

## 来源阶段

[phase-4：消息中心、系统监控与页面模板](../../by-phase/phase-4.md)、[phase-7（子项）：数据权限与审计字段](../../by-phase/phase-7-data-permission-audit.md)

## 目标

记录用户关键操作，支持按路径/模型查询。

## 关键实现

- `operation_logs` 表
- 请求日志中间件自动记录所有 API 请求
- 动态 CRUD 请求通过路径区分具体模型

## 验收标准

- [x] 所有 API 请求被记录
- [x] 可查看操作日志列表
