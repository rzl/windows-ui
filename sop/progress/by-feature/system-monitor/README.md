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
| 系统监控增强 | [phase-27](../../by-phase/phase-27.md) | API 性能统计、慢 SQL 分析、告警规则与告警记录 | ✅ |
| 监控告警与日志治理 | [phase-30](../../by-phase/phase-30.md) | 数据保留策略、告警实时推送、P95/P99 分位数 | ✅ |

## 待增强

- [ ] 邮件 / 短信告警推送
- [ ] 告警规则支持更多通知渠道配置
- [ ] 监控大盘支持自定义布局
