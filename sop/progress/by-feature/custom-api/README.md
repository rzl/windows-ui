# 主功能：自定义接口

## 目标

管理员可通过 Monaco 编辑器在线编写 JavaScript 脚本，快速发布自定义 HTTP 接口，支持数据库访问、内部 API 调用和多层路径。

## 子线清单

| 子线 | 阶段 | 内容 | 状态 |
|------|------|------|------|
| 自定义接口管理 | [phase-18](../../by-phase/phase-18.md) | 接口 CRUD、路径配置、公开/登录访问控制 | ✅ |
| Monaco 编辑器集成 | [phase-18](../../by-phase/phase-18.md) | iframe 方案加载 Monaco Editor | ✅ |
| 脚本执行引擎 | [phase-18](../../by-phase/phase-18.md) | 基于 vm2 的公共脚本执行器 | ✅ |
| 自定义接口版本管理 | [phase-24](../../by-phase/phase-24.md) | 接口快照、历史版本、回滚 | ✅ |
| 自定义接口安全加固 | [phase-29](../../by-phase/phase-29.md) | 频率限制、IP 白名单/黑名单、超时配置、执行日志审计 | ✅ |
| 自定义接口日志治理 | [phase-30](../../by-phase/phase-30.md) | 执行日志保留天数、频率限制 Redis 存储 | ✅ |

## 待增强

- [ ] Monaco 资源按页面懒加载
