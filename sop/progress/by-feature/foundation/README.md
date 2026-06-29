# 主功能：基础平台

## 目标

搭建低代码平台可运行、可扩展、可交接的基础骨架，包括 SOP 文档体系、后端脚手架、前端包初始化、通用组件扩展与基础页面模板。

## 子线清单

| 子线 | 阶段 | 内容 | 状态 |
|------|------|------|------|
| 项目基础框架 | [phase-1](../../by-phase/phase-1.md) | SOP 目录结构、README、架构与数据库文档 | ✅ |
| 后端脚手架 | [phase-1](../../by-phase/phase-1.md) | Express + Knex + SQLite、迁移种子、统一响应/错误/日志 | ✅ |
| lowcode-admin 初始化 | [phase-1](../../by-phase/phase-1.md) | Vite 配置、axios 封装、Pinia、路由与布局 | ✅ |
| 认证与会话管理 | - | 双令牌刷新、启动校验、未登录/过期自动跳转登录、登录后回源 | ✅ |
| 通用组件扩展 | [phase-1](../../by-phase/phase-1.md) | WCrudTable、WDynamicForm、WQueryBuilder | ✅ |
| 页面模板 | [phase-4](../../by-phase/phase-4.md) | 结果页、异常页（403/404/500）、个人页 | ✅ |

## 待增强

- [ ] 前端包构建产物体积优化
- [ ] 后端错误监控与告警
- [ ] 页面模板扩展（空白页、登录页模板）
