# 阶段四：消息中心、系统监控与页面模板

## 目标

补齐企业级运行支撑能力与常用页面模板。

## 功能清单

### 消息中心
- 消息管理：查看、标记已读、删除
- 模板管理：消息模板增删改查
- 发送渠道：短信、邮件、微信推送（占位实现，记录日志）

### 系统监控
- 服务器信息：OS、CPU、内存、Node 版本、运行时长
- 在线用户：基于 token 黑名单反向统计或内存记录
- 操作日志：记录用户关键操作
- SQL/请求日志：记录慢请求与 SQL 执行（占位）
- 定时任务：基于 node-cron 的示例任务
- 数据日志：记录数据快照（基于 lowcode_models 变更）

### 页面模板
- 结果页：成功 / 失败
- 异常页：403 / 404 / 500
- 个人页：用户信息展示

### 高级功能
- WebSocket 消息通知机制

## 任务清单

- [x] 实现消息中心后端 API（消息、模板、渠道占位）
- [x] 实现系统监控后端 API（服务器信息、在线用户、操作日志、SQL日志）
- [x] 实现 WebSocket 消息通知机制
- [x] 实现 lowcode-admin 消息中心页面
- [x] 实现 lowcode-admin 系统监控页面
- [x] 实现结果页/异常页/个人页模板
- [x] 更新路由、菜单与种子数据
- [x] 构建与联调验证

## 验收标准

- 可查看服务器运行信息
- 可发送并查看站内消息（WebSocket 实时推送）
- 可查看操作日志
- 403/404/500 异常页面可用
- 个人页可展示当前用户信息
- `pnpm build:server` 与 `pnpm build:lowcode` 通过

## 运行记录

- 2026-06-13：新增 monitor 模块（messages/message_templates/operation_logs/data_logs）
- 2026-06-13：集成 WebSocket（ws），发消息时实时推送给接收人
- 2026-06-13：新增请求日志中间件，自动记录所有 API 请求
- 2026-06-13：完成 MessageList、MessageTemplateList、ServerMonitor、OperationLogList 页面
- 2026-06-13：完成 ResultPage、ExceptionPage、ProfilePage 页面模板
- 2026-06-13：`pnpm build:server` 与 `pnpm build:lowcode` 通过，API 联调通过
