# 主功能：系统监控

## 目标

提供服务器运行状态、操作日志、在线用户等企业级监控能力。

## 子线清单

| 子线 | 阶段 | 内容 | 状态 |
|------|------|------|------|
| 服务器信息 | [phase-4](../../by-phase/phase-4.md) | OS、CPU、内存、Node 版本、运行时长 | ✅ |
| 在线用户 | [phase-4](../../by-phase/phase-4.md) | 基于 token 黑名单反向统计 | ✅ |
| 操作日志 | [phase-4](../../by-phase/phase-4.md)、[phase-7](../../by-phase/phase-7-data-permission-audit.md) | 请求日志中间件、动态 CRUD 操作记录 | ✅ |
| SQL/请求日志 | [phase-4](../../by-phase/phase-4.md) | 记录所有 API 请求 | ✅ |
| 数据日志 | [phase-4](../../by-phase/phase-4.md) | 基于 lowcode_models 变更的数据快照 | ✅ |

## 待增强

- [ ] 慢 SQL 分析与告警
- [ ] 接口性能统计
- [ ] 监控数据持久化与图表展示
- [ ] 异常告警通知
