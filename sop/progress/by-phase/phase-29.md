# 阶段二十九：自定义接口安全加固

## 目标

为低代码自定义接口增加安全与审计能力，包括频率限制、IP 白名单/黑名单、脚本超时按接口配置、执行日志记录，降低自定义脚本被滥用或攻击的风险。

## 功能清单

### 1. 频率限制

- 每个自定义接口可独立配置请求频率限制。
- 支持窗口单位：每秒 / 每分钟 / 每小时 / 每天。
- 0 表示不限制。
- 按接口 + 用户（登录态）或接口 + IP（未登录态）维度统计。
- 超出限制时返回 `429 Too Many Requests`。

### 2. IP 白名单 / 黑名单

- 每个接口可配置 IP 白名单和黑名单。
- 支持单行一个 IP，支持简单 CIDR（如 `192.168.1.0/24`）。
- 黑名单优先：命中黑名单直接拒绝。
- 配置了白名单时，只有白名单内 IP 可访问。
- IP 访问受限时返回 `403 Forbidden`。

### 3. 脚本超时按接口配置

- 原 `script-runner.ts` 固定 5000ms 超时，现改为按接口配置。
- 接口编辑页可设置超时时间（100ms ~ 60000ms）。
- 未配置时默认 5000ms。

### 4. 执行日志审计

- 新增 `custom_api_logs` 表记录每次接口调用：
  - 接口 ID、编码、路径
  - 调用者用户 ID / 用户名
  - IP 地址、请求方法
  - 请求参数快照
  - 响应快照（前 2000 字符）
  - 执行耗时
  - 成功 / 失败状态
  - 错误信息
  - 调用时间
- 接口编辑页可查看该接口的执行日志列表。
- 提供 `GET /api/custom-apis/:id/logs` 查询日志。

### 5. 前端编辑器增强

- `CustomApiEditor.vue` 新增「安全配置」卡片：
  - 频率限制数值 + 窗口单位
  - IP 白名单 textarea
  - IP 黑名单 textarea
  - 超时时间
- 新增「执行日志」卡片，分页展示最近调用记录。

## 数据表

### lowcode_custom_apis（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| rate_limit | int | 频率限制次数，0 为不限制 |
| rate_limit_window | varchar(20) | second/minute/hour/day |
| ip_whitelist | text | IP 白名单 JSON 数组 |
| ip_blacklist | text | IP 黑名单 JSON 数组 |
| timeout | int | 脚本执行超时毫秒数，默认 5000 |

### custom_api_logs

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| api_id | int | 接口 ID |
| api_code | varchar(50) | 接口编码 |
| api_path | varchar(255) | 接口路径 |
| user_id | int | 用户 ID |
| username | varchar(100) | 用户名 |
| ip | varchar(50) | IP 地址 |
| method | varchar(10) | 请求方法 |
| params | text | 请求参数 JSON |
| response_snapshot | text | 响应快照 |
| duration | int | 执行耗时 ms |
| status | tinyint | 1 成功，0 失败 |
| error_message | text | 错误信息 |
| create_time | timestamp | 调用时间 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/custom-apis/:id/logs | 查询接口执行日志 |

自定义接口调用仍使用：

| 方法 | 路径 | 说明 |
|------|------|------|
| ALL | /api/custom/* | 执行自定义接口 |

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260627030000_custom_api_security.ts` | 安全字段与日志表迁移 |
| `packages/server/src/modules/custom-api/custom-api-security.service.ts` | 频率限制、IP 检查、日志服务 |
| `sop/progress/by-phase/phase-29.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/utils/script-runner.ts` | runScript 支持 timeout 参数 |
| `packages/server/src/modules/custom-api/custom-api.service.ts` | 保存安全字段、执行时调用安全检查与日志 |
| `packages/server/src/modules/custom-api/custom-api.controller.ts` | 增加 getApiLogs、ctx 中补充 ip |
| `packages/server/src/modules/custom-api/custom-api.routes.ts` | 注册日志查询路由 |
| `packages/lowcode-admin/src/api/customApi.ts` | 增加安全字段类型与日志查询 API |
| `packages/lowcode-admin/src/views/lowcode/CustomApiEditor.vue` | 安全配置表单与执行日志展示 |
| `sop/manuals/lowcode/custom-api.md` | 更新用户手册 |
| `sop/progress/README.md` | 添加 phase-29 |
| `sop/progress/by-feature/custom-api/README.md` | 更新子线状态 |

## 任务清单

- [x] 设计安全加固方案
- [x] 数据库迁移：新增安全字段与 custom_api_logs 表
- [x] 后端：频率限制实现
- [x] 后端：IP 白名单 / 黑名单实现（含简单 CIDR）
- [x] 后端：脚本超时按接口配置
- [x] 后端：执行日志记录
- [x] 后端：日志查询接口
- [x] 前端：CustomApiEditor 安全配置表单
- [x] 前端：执行日志展示
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 可配置接口频率限制，超出后返回 429。
2. [x] 可配置 IP 白名单/黑名单，命中后返回 403。
3. [x] 脚本超时时间可按接口配置。
4. [x] 每次接口调用记录执行日志。
5. [x] 前端编辑器可配置安全项并查看日志。
6. [x] `pnpm db:migrate`、`pnpm build`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **频率限制内存存储**：当前使用进程内存 Map，服务重启后计数清零，多实例部署时不共享。后续可接入 Redis。
2. **日志量增长**：高频调用接口会产生大量日志，后续需增加自动清理或归档策略。
3. **CIDR 匹配简化**：当前仅支持 IPv4 简单 CIDR，IPv6 暂不支持。
4. **测试接口不记录日志**：`testCustomApi` 仅使用超时配置，不记录执行日志、不触发频率限制和 IP 检查，避免影响线上统计。
