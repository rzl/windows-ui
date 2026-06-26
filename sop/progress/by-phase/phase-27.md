# 阶段二十七：系统监控增强

## 目标

完善低代码平台的系统监控能力，实现 API 性能统计、慢 SQL 分析、监控数据持久化与告警通知，帮助运维人员快速定位系统瓶颈与异常。

## 功能清单

### 1. API 性能统计

- 自动采集所有 API 请求：方法、路径、状态码、耗时、用户、IP、参数。
- 存储到 `api_metrics` 表。
- 提供最近 24 小时趋势图（按分钟聚合）。
- 提供慢接口 TOP10 排行。
- 提供总请求数、慢请求数（>1s）、服务端错误数统计。

### 2. 慢 SQL 分析

- 通过 Knex 事件监听自动采集执行耗时超过阈值的 SQL。
- 存储到 `sql_metrics` 表。
- 支持按关键字和最小耗时过滤。
- 提供慢 SQL 总数与最大耗时统计。

### 3. 告警规则

- 支持 4 种告警类型：
  - `api_slow`：接口响应慢
  - `sql_slow`：SQL 执行慢
  - `error_rate`：错误率过高
  - `server_load`：服务器负载高
- 规则字段：名称、类型、阈值、统计窗口、启用状态、通知渠道、接收人。
- 支持增删改查。

### 4. 告警记录

- 告警触发时写入 `alert_records` 表。
- 支持标为已读、解决、未读数量查询。
- 提供「立即检查」手动触发按钮。
- 后端每 60 秒自动执行一次告警检查。

### 5. 前端监控仪表盘

- 扩展「服务器监控」页面，集成：
  - 性能概览卡片
  - API 请求趋势条形图
  - 慢接口 TOP10
  - 慢 SQL 列表
  - 告警规则配置
  - 告警记录列表

## 数据表

### api_metrics

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| method | varchar(10) | 请求方法 |
| path | varchar(255) | 请求路径 |
| status_code | int | HTTP 状态码 |
| duration | int | 耗时（ms） |
| user_id | int | 用户 ID |
| username | varchar(100) | 用户名 |
| ip | varchar(50) | IP 地址 |
| params | text | 请求参数 JSON |
| created_at | timestamp | 创建时间 |

### sql_metrics

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| sql | text | SQL 文本 |
| bindings | text | 绑定参数 JSON |
| duration | int | 耗时（ms） |
| created_at | timestamp | 创建时间 |

### alert_rules

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| name | varchar(100) | 规则名称 |
| type | varchar(50) | 告警类型 |
| threshold | int | 阈值 |
| window_minutes | int | 统计窗口（分钟） |
| enabled | tinyint | 是否启用 |
| notify_channel | varchar(50) | 通知渠道 |
| receiver_ids | text | 接收人 ID JSON 数组 |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

### alert_records

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| rule_id | int | 规则 ID |
| rule_name | varchar(100) | 规则名称 |
| type | varchar(50) | 告警类型 |
| message | text | 告警内容 |
| snapshot | text | 快照 JSON |
| is_read | tinyint | 是否已读 |
| status | varchar(20) | pending / resolved |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/monitor/api-metrics | API 请求明细 |
| GET | /api/monitor/api-performance-stats | API 性能统计 |
| GET | /api/monitor/api-trend | API 请求趋势 |
| GET | /api/monitor/slow-sqls | 慢 SQL 列表 |
| GET | /api/monitor/sql-performance-stats | SQL 性能统计 |
| GET | /api/monitor/alert-rules | 告警规则列表 |
| POST | /api/monitor/alert-rules | 创建告警规则 |
| PUT | /api/monitor/alert-rules/:id | 更新告警规则 |
| DELETE | /api/monitor/alert-rules/:id | 删除告警规则 |
| GET | /api/monitor/alert-records | 告警记录列表 |
| GET | /api/monitor/alert-records/unread-count | 未读告警数 |
| PUT | /api/monitor/alert-records/:id/read | 标为已读 |
| PUT | /api/monitor/alert-records/:id/resolve | 解决告警 |
| POST | /api/monitor/check-alerts | 手动触发告警检查 |

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260627020000_create_monitor_metrics.ts` | 监控指标表迁移 |
| `packages/server/src/modules/monitor/alert.service.ts` | 告警规则与告警记录服务 |
| `sop/progress/by-phase/phase-27.md` | 本阶段进度文档 |
| `sop/manuals/system/monitor.md` | 用户手册 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/db/index.ts` | 添加 Knex 慢 SQL 采集 |
| `packages/server/src/middleware/requestLog.ts` | 同时写入 api_metrics |
| `packages/server/src/modules/monitor/monitor.service.ts` | 增加 API 性能统计函数 |
| `packages/server/src/modules/monitor/monitor.controller.ts` | 增加监控与告警控制器 |
| `packages/server/src/modules/monitor/monitor.routes.ts` | 注册新路由 |
| `packages/server/src/index.ts` | 启动告警检查定时器 |
| `packages/lowcode-admin/src/api/monitor.ts` | 前端 API 封装 |
| `packages/lowcode-admin/src/views/monitor/ServerMonitor.vue` | 扩展为系统监控仪表盘 |
| `sop/progress/README.md` | 添加 phase-27 |
| `sop/progress/by-feature/system-monitor/README.md` | 更新子线 |

## 任务清单

- [x] 设计监控指标表结构
- [x] 数据库迁移：创建 api_metrics / sql_metrics / alert_rules / alert_records
- [x] 后端：API 请求性能采集
- [x] 后端：慢 SQL 自动采集
- [x] 后端：API 性能统计与趋势接口
- [x] 后端：告警规则 CRUD
- [x] 后端：告警检查与告警记录
- [x] 后端：启动定时告警检查
- [x] 前端：扩展 ServerMonitor 页面
- [x] 前端：性能概览、趋势图、慢接口、慢 SQL
- [x] 前端：告警规则与告警记录管理
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] API 请求自动采集并展示趋势图。
2. [x] 慢 SQL 自动采集并支持过滤查询。
3. [x] 告警规则支持 4 种类型，可增删改查。
4. [x] 告警检查每 60 秒自动执行，支持手动触发。
5. [x] 告警记录可标为已读和解决。
6. [x] 前端监控仪表盘展示完整性能数据。
7. [x] `pnpm db:migrate`、`pnpm build`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **监控数据量**：高频请求场景下 `api_metrics` 和 `sql_metrics` 可能快速增长，后续需增加自动清理策略。
2. **告警通知渠道**：当前主要记录告警记录，邮件 / 短信 / WebSocket 实时推送需要额外接入。
3. **慢 SQL 阈值**：默认 100ms，后续可在告警规则中单独配置或支持全局配置。
4. **性能影响**：Knex 事件监听和请求日志写入会带来少量性能开销，生产环境可改为异步队列。
