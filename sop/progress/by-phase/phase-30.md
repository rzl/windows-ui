# 阶段三十：监控告警与日志治理

## 目标

解决 phase-27（系统监控增强）与 phase-29（自定义接口安全加固）遗留的数据量增长、内存存储、告警通知渠道等风险点，完善低代码平台的可观测性与稳定性。

## 功能清单

### 1. 监控数据自动清理策略

- 新增 `data_retention_policies` 表统一管理监控类数据保留策略。
- 默认策略：
  - `api_metrics`：保留 30 天
  - `sql_metrics`：保留 30 天
  - `alert_records`：保留 90 天
  - `custom_api_logs`：保留 30 天
  - `operation_logs`：保留 180 天
  - `data_logs`：保留 180 天
- 支持通过接口调整保留天数与启用状态。
- 后端每 6 小时自动执行一次清理。
- 提供手动触发清理接口。

### 2. 自定义接口执行日志保留策略

- `lowcode_custom_apis` 表新增 `log_retention_days` 字段。
- 每个接口可独立配置执行日志保留天数，0 表示不限制。
- 未配置时默认 30 天。
- 后端清理任务按接口维度清理过期日志。

### 3. 告警实时推送

- 告警规则触发产生 `alert_records` 后，通过 WebSocket 向接收人在线客户端推送 `new_alert` 消息。
- 同时向接收人发送站内消息，未读消息计入顶部通知中心。
- 告警记录标为已读时同步更新站内消息状态。

### 4. 频率限制存储抽象

- 将自定义接口频率限制从进程内 Map 抽象为 `RateLimitStore` 接口。
- 默认实现为内存 Map（保持原有行为）。
- 当环境配置 `REDIS_URL` 时，自动切换为 Redis 实现（基于 `ioredis`）。
- 支持多实例部署时共享限流计数。

### 5. 接口性能分位数统计

- `GET /api/monitor/api-performance-stats` 返回增加 `p95`、`p99` 字段。
- 使用 SQLite 可实现的排序取位法计算分位数。
- 前端监控仪表盘增加 P95/P99 展示卡片。

### 6. 前端监控页增强

- 新增「数据治理」卡片：展示保留策略列表、支持编辑、提供「立即清理」按钮。
- 性能概览增加 P95 / P99 卡片。

### 7. 自定义接口编辑器增强

- 安全配置卡片新增「日志保留天数」配置。
- 执行日志卡片增加手动清理该接口过期日志的按钮。

## 数据表

### data_retention_policies（新增）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| table_name | varchar(100) | 目标表名，唯一 |
| retention_days | int | 保留天数，0 表示不自动清理 |
| enabled | tinyint | 是否启用自动清理 |
| last_cleanup_time | timestamp | 上次清理时间 |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

### lowcode_custom_apis（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| log_retention_days | int | 执行日志保留天数，默认 30，0 表示不限制 |

## 接口约定

### 数据治理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/monitor/retention-policies | 查询保留策略列表 |
| PUT | /api/monitor/retention-policies/:id | 更新保留策略 |
| POST | /api/monitor/run-cleanup | 手动触发清理 |

### 自定义接口

`CustomApiForm` 与 `lowcode_custom_apis` 增加 `logRetentionDays` / `log_retention_days` 字段。

### 告警推送

- WebSocket 消息类型：`new_alert`
- 站内消息类型：`alert`，business_type 为 `alert_record`

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260702010000_data_governance.ts` | 数据治理表与自定义接口日志保留字段迁移 |
| `packages/server/src/modules/monitor/data-governance.service.ts` | 保留策略查询、更新、清理逻辑 |
| `packages/server/src/utils/rate-limit-store.ts` | 频率限制存储抽象与内存/Redis 实现 |
| `sop/progress/by-phase/phase-30.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/monitor/monitor.controller.ts` | 增加数据治理接口 |
| `packages/server/src/modules/monitor/monitor.routes.ts` | 注册数据治理路由 |
| `packages/server/src/modules/monitor/alert.service.ts` | 告警触发后 WebSocket 推送 + 站内消息 |
| `packages/server/src/modules/custom-api/custom-api-security.service.ts` | 接入 RateLimitStore 抽象 |
| `packages/server/src/modules/custom-api/custom-api.service.ts` | 保存/更新 `log_retention_days` |
| `packages/server/src/config/index.ts` | 增加 Redis 配置 |
| `packages/server/src/index.ts` | 启动数据治理定时清理 |
| `packages/lowcode-admin/src/api/monitor.ts` | 增加数据治理 API |
| `packages/lowcode-admin/src/views/monitor/ServerMonitor.vue` | 增加数据治理与 P95/P99 展示 |
| `packages/lowcode-admin/src/api/customApi.ts` | 增加 `logRetentionDays` 字段类型 |
| `packages/lowcode-admin/src/views/lowcode/CustomApiEditor.vue` | 增加日志保留天数与手动清理 |
| `sop/progress/README.md` | 添加 phase-30 |
| `sop/progress/by-feature/system-monitor/README.md` | 更新子线状态 |
| `sop/progress/by-feature/custom-api/README.md` | 更新子线状态 |
| `sop/manuals/system/monitor.md` | 更新用户手册 |
| `sop/manuals/lowcode/custom-api.md` | 更新用户手册 |

## 任务清单

- [x] 数据库迁移：创建 data_retention_policies 与 lowcode_custom_apis.log_retention_days
- [x] 后端：数据保留策略 CRUD 与自动清理
- [x] 后端：自定义接口日志按接口保留天数清理
- [x] 后端：告警触发后 WebSocket 实时推送 + 站内消息
- [x] 后端：频率限制存储抽象（内存 + Redis）
- [x] 后端：接口性能统计增加 P95/P99
- [x] 后端：启动定时清理任务
- [x] 前端：ServerMonitor 增加数据治理与 P95/P99
- [x] 前端：CustomApiEditor 增加日志保留天数
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 保留策略可配置，后台每 6 小时自动清理过期数据。
2. [x] 自定义接口可独立配置执行日志保留天数。
3. [x] 告警触发后在线用户能实时收到 WebSocket 通知与站内消息。
4. [x] 配置 `REDIS_URL` 后自定义接口频率限制在多实例间共享。
5. [x] 接口性能统计返回 P95/P99，前端正确展示。
6. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **Redis 可选依赖**：频率限制 Redis 实现基于 `ioredis`，未配置时自动降级为内存实现。
2. **告警站内消息接收人**：当前按告警规则 `receiverIds` 发送；若未配置接收人，则推送给所有在线管理员。
3. **清理任务性能**：大数据量下清理可能影响写入，可考虑后续改为按时间范围分批删除。
