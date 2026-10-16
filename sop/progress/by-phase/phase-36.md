# Phase 36：安全加固与正确性修复

> 时间：2026-10。本轮为一次全面代码审计后的集中修复，覆盖认证链路、脚本沙箱、RBAC、流程引擎、元数据一致性与前端构建。

## 目标

修复审计发现的高危安全缺口（认证绕过链、沙箱超时失效、设计时接口零权限）、功能性 bug（数据权限 roles 分支失效、流程引擎并发问题、元数据-DDL 不一致）以及性能短板（元数据零缓存、SQLite 裸奔、前端单包 550KB）。

## 安全加固（全部完成 ✅）

| 修复项 | 说明 |
|--------|------|
| 内部服务认证 | 移除 `x-dashboard-service` 头放行后门，改为共享密钥 `x-internal-token`（`INTERNAL_API_SECRET` 环境变量可配，默认每次启动随机生成）+ 本机回环校验 + 定时常数比较 |
| 脚本沙箱硬超时 | 自定义接口脚本迁移到 worker_threads 执行，超时强制 terminate，内存上限 128MB；SQL 白名单校验全部移到主线程，新增敏感系统表禁读（users/roles/menus/权限规则等）；worker 不可用时自动降级主线程执行 |
| JWT 治理 | access/refresh 令牌增加 `tokenType` 声明，refresh 不能再当 access 使用；刷新时轮换并吊销旧 refresh；登出同时吊销 access + refresh；黑名单带过期时间自动清理（生产多实例建议接 Redis） |
| 错误响应规范化 | 业务错误返回真实 HTTP 状态码（401/403/404/500），未知错误不再向客户端泄露内部信息；新增 404 兜底路由 |
| 请求日志脱敏 | password/token/secret 类字段写日志前替换为 `******`（此前登录请求明文密码直接入库） |
| 上传限制 | 文件类型白名单（图片/文档/压缩包/音视频，排除 html/svg/js 等可执行内容）+ 单文件 10MB 上限 |
| WebSocket 鉴权 | 握手阶段凭 JWT 校验身份（`ws://host/?token=xxx`），不再信任客户端自我申报；新增 30 秒心跳与死连接回收 |
| 设计时 RBAC | 新增 `requirePermission` 中间件：模型/字段/表单等设计操作要求 `lowcode:design`，自定义接口 `custom-api:design`，插件 `plugin:manage`，定时任务 `schedule:manage`，用户/角色/菜单/部门 `rbac:manage`，流程定义 `flow:design`，应用管理 `app:manage`；超管角色（ADMIN_ROLE_ID 或 `*` 权限码）自动放行 |
| 插件源码保护 | `/api/plugins/active` 未登录只返回插件元信息，不暴露 `runtime_code`/`runtime_url`；前端登录成功后重新初始化插件 |

## 正确性修复（全部完成 ✅）

| 修复项 | 说明 |
|--------|------|
| 数据权限 roles 分支 | 此前角色维度规则是空操作（名单内外都不附加条件）；现与 users 分支语义一致：名单外用户不通过该规则获得数据 |
| 流程引擎事务与并发 | handleTask 全程事务包裹；任务与实例状态推进用条件更新做乐观锁（防止双人同时审批双重推进）；会签达成后取消同节点剩余 pending 任务（新增 `cancelled` 状态）；审批按实例保存的 `definition_version` 取定义；流程实例创建与首节点进入事务化；强制终止事务化 |
| 审批越权校验 | 通过/驳回/转办校验操作人是审批人本人/被委托人/超管（系统超时自动流转不受限） |
| 元数据-DDL 一致性 | createModel/createField/updateField/deleteModel 元数据写入与物理表 DDL 包事务；字段类型变更真实生效（跨列类型种类变化时重建物理表并保留数据，替代原空操作占位） |
| rebuildTable | 移除事务内无效的 PRAGMA foreign_keys（动态表无外键约束）；保留列补全 `tenant_id`/`update_by`；重建后自动补回系统列索引 |
| 前端 blob 拦截器 | 修复导出/模板下载全部失败的 bug（blob 响应被拦截器按 JSON 剥壳导致 reject）；后端对 blob 请求返回 JSON 错误时正确解析提示 |
| 后台任务租户上下文 | systemReq 使用 ADMIN_ROLE_ID/GLOBAL_TENANT_ID 常量成为真正的超管身份（此前 `tenant_id: ''` 过滤导致告警检查与日志清理永远匹配不到行） |

## 性能优化（全部完成 ✅）

| 优化项 | 说明 |
|--------|------|
| 元数据进程内缓存 | 模型元数据（getModelByCode）与活动插件走 30 秒 TTL 缓存，设计时变更全量失效；单次动态列表请求 SQL 从 12~25 条降到 3~5 条 |
| SQLite 调优 | 连接池 afterCreate 启用 WAL + busy_timeout 5000 + synchronous NORMAL；动态表自动补 `tenant_id/create_by/dept_id/create_time` 系统列索引（新建即建，存量表首次访问幂等补齐） |
| 慢 SQL 采集泄漏 | 补 `query-error` 监听清理计时条目，修复查询失败导致的 Map 泄漏 |
| 前端构建拆分 | manualChunks 拆出 vendor（156KB）/windows-ui（354KB）/vue-flow（219KB）独立 chunk；流程设计器改 defineAsyncComponent 按需加载；业务入口从 550KB 降到 31.5KB |
| dynamicList 防护 | pageSize 上限 1000；存量动态表索引补齐 |
| 请求层体验 | API 错误弹真实 toast（LowcodePage 挂载 w-message 宿主 + toast 工具，登录页降级 console）；异步导出轮询组件卸载时清理；导出完成/失败提示 |

## 遗留与后续

- [ ] vm2 仍用于脚本沙箱（已停止维护、存在历史逃逸 CVE），本轮通过 worker 隔离 + 资源限制缓解；彻底替代需迁移 isolated-vm 或独立进程池
- [ ] token 黑名单为进程内存，多实例部署需接 Redis（ioredis 依赖已具备）
- [ ] 前端 echarts 图表仍走 CDN iframe，离线环境需本地化
- [ ] 设计器（表单/列表/流程）的撤销重做、节点坐标持久化等体验优化
- [ ] 33 个 CRUD 视图样板代码收敛（useCrud composable）
