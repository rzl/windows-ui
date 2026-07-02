# 数据库设计

> 默认使用 SQLite，所有表结构使用 Knex 迁移管理。字段命名采用 snake_case，JavaScript 层使用 camelCase 转换。

## 核心表

### users（用户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| username | string | 用户名（联合唯一：tenant_id + username） |
| password | string | bcrypt 加密密码 |
| nickname | string | 昵称 |
| email | string | 邮箱 |
| phone | string | 手机号 |
| avatar | string | 头像 URL |
| status | integer | 0 禁用 / 1 启用 |
| dept_id | integer FK | 部门 ID |
| role_id | integer FK | 默认角色 ID |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### roles（角色表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| name | string | 角色名称 |
| code | string | 角色编码（联合唯一：tenant_id + code） |
| description | string | 描述 |
| status | integer | 0 禁用 / 1 启用 |
| create_time | datetime | 创建时间 |

### menus（菜单表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| parent_id | integer FK | 父菜单 ID，0 为根 |
| name | string | 路由名称 |
| path | string | 路由路径 |
| component | string | 组件路径 |
| title | string | 显示标题 |
| icon | string | 图标 |
| sort | integer | 排序 |
| status | integer | 0 禁用 / 1 启用 |
| permission | string | 权限码 |

### role_permissions（角色权限关联表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| role_id | integer FK | 角色 ID |
| permission | string | 权限码 |

### depts（部门表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| parent_id | integer FK | 父部门 ID |
| name | string | 部门名称 |
| code | string | 部门编码 |
| sort | integer | 排序 |
| status | integer | 0 禁用 / 1 启用 |

### dicts（字典表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| name | string | 字典名称 |
| code | string | 字典编码（联合唯一：tenant_id + code） |
| description | string | 描述 |
| status | integer | 0 禁用 / 1 启用 |

### dict_items（字典项表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| dict_id | integer FK | 字典 ID |
| label | string | 显示标签 |
| value | string | 值 |
| sort | integer | 排序 |
| status | integer | 0 禁用 / 1 启用 |

## 多租户

### tenants（租户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| name | string | 租户名称 |
| code | string UNIQUE | 租户编码 |
| description | text | 描述 |
| status | integer | 0 禁用 / 1 启用 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 租户隔离范围

当前已实现隔离的核心系统表（均含 `tenant_id`）：

- `users`（username 唯一索引改为 `(tenant_id, username)`）
- `roles`、`depts`、`menus`
- `dicts`、`dict_items`
- `role_permissions`、`role_apps`
- `lowcode_apps`、`lowcode_app_items`、`lowcode_app_versions`
- `lowcode_pages`

超级管理员（当前以 `role_id === 1` 判定）可跨租户访问，普通用户仅可访问 `tenant_id` 与本用户 `tenant_id` 一致的数据。

## 后续扩展表

- `tenant_packages`：租户套餐
- `data_sources`：多数据源配置
- `white_lists`：白名单
- `third_party_configs`：第三方配置
- `announcements`：系统公告
- `jobs`：定时任务
- `messages` / `message_templates`：消息中心
- `operation_logs`：操作日志
- `data_logs`：数据变更日志
- `api_metrics` / `sql_metrics`：API 与 SQL 性能指标
- `alert_rules` / `alert_records`：告警规则与告警记录
- `data_retention_policies`：数据保留策略
- `custom_api_logs`：自定义接口执行日志
- `flow_definitions` / `flow_instances` / `flow_tasks` / `flow_delegations`：工作流引擎
- `lowcode_models` / `lowcode_fields` / `lowcode_forms` / `lowcode_tables`：低代码元数据
- `lowcode_custom_apis`：自定义接口
- `lowcode_pages`：自定义页面配置
- `lowcode_apps` / `lowcode_app_items` / `lowcode_app_versions`：应用定义、应用资源、应用版本快照

### lowcode_pages（自定义页面表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| tenant_id | integer FK | 租户 ID |
| code | string | 页面编码（联合唯一：tenant_id + code） |
| name | string | 页面名称 |
| description | text | 页面描述 |
| config | text | 页面 JSON 配置 |
| status | integer | 0 禁用 / 1 启用 |
| permission | string | 页面权限码，为空表示不限制 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

页面配置中的 `components` 数组支持嵌套，容器类组件通过 `children` 字段组织子组件。每个组件可配置 `props`、`styles`、`dataSource` 与 `events`。

## 监控与治理表

### api_metrics（API 性能指标）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| method | string | 请求方法 |
| path | string | 请求路径 |
| status_code | integer | HTTP 状态码 |
| duration | integer | 请求耗时 ms |
| user_id | integer | 用户 ID |
| username | string | 用户名 |
| ip | string | IP 地址 |
| params | text | 请求参数 JSON |
| created_at | datetime | 创建时间 |

### sql_metrics（慢 SQL 指标）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| sql | text | SQL 文本 |
| bindings | text | 绑定参数 JSON |
| duration | integer | 执行耗时 ms |
| created_at | datetime | 创建时间 |

### alert_rules（告警规则）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| name | string | 规则名称 |
| type | string | api_slow / sql_slow / error_rate / server_load |
| threshold | integer | 阈值 |
| window_minutes | integer | 统计窗口分钟数 |
| enabled | integer | 是否启用 |
| notify_channel | string | 通知渠道 |
| receiver_ids | text | 接收人 ID JSON 数组 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### alert_records（告警记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| rule_id | integer | 规则 ID |
| rule_name | string | 规则名称 |
| type | string | 告警类型 |
| message | text | 告警内容 |
| snapshot | text | 快照 JSON |
| is_read | integer | 是否已读 |
| status | string | pending / resolved |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### data_retention_policies（数据保留策略）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| table_name | string UNIQUE | 目标表名 |
| retention_days | integer | 保留天数，0 表示不自动清理 |
| enabled | integer | 是否启用 |
| last_cleanup_time | datetime | 上次清理时间 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### custom_api_logs（自定义接口执行日志）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| api_id | integer | 接口 ID |
| api_code | string | 接口编码 |
| api_path | string | 接口路径 |
| user_id | integer | 用户 ID |
| username | string | 用户名 |
| ip | string | IP 地址 |
| method | string | 请求方法 |
| params | text | 请求参数 JSON |
| response_snapshot | text | 响应快照 |
| duration | integer | 执行耗时 ms |
| status | integer | 1 成功 / 0 失败 |
| error_message | text | 错误信息 |
| create_time | datetime | 创建时间 |

### lowcode_custom_apis（自定义接口表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| code | string UNIQUE | 接口编码 |
| name | string | 接口名称 |
| method | string | 请求方法 |
| path | string | 接口路径 |
| description | text | 描述 |
| script | text | 脚本内容 |
| status | integer | 0 禁用 / 1 启用 |
| is_public | integer | 是否公开访问 |
| rate_limit | integer | 频率限制次数 |
| rate_limit_window | string | 频率限制窗口 |
| ip_whitelist | text | IP 白名单 JSON 数组 |
| ip_blacklist | text | IP 黑名单 JSON 数组 |
| timeout | integer | 脚本超时 ms |
| log_retention_days | integer | 执行日志保留天数 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

## 工作流表

### flow_definitions（流程定义表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| code | string | 流程编码 |
| name | string | 流程名称 |
| model_code | string | 关联模型编码 |
| config | text | 流程 JSON 配置 |
| status | integer | 0 禁用 / 1 启用 |
| version | integer | 版本号 |
| is_latest | integer | 是否为最新版本 |
| remark | string | 版本说明 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### flow_instances（流程实例表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| flow_code | string | 流程编码 |
| business_key | integer | 业务主键 |
| status | string | running / completed / rejected / terminated |
| current_node_id | string | 当前节点 ID |
| starter_id | integer | 发起人 ID |
| starter_name | string | 发起人姓名 |
| business_data | text | 业务数据 JSON |
| definition_version | integer | 启动时流程定义版本 |
| terminated_by | integer | 强制终止人 ID |
| terminated_reason | text | 强制终止原因 |
| terminated_time | datetime | 强制终止时间 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### flow_tasks（流程任务表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| instance_id | integer | 流程实例 ID |
| node_id | string | 节点 ID |
| node_name | string | 节点名称 |
| assignee_type | string | role / user / dept |
| assignee_value | string | 审批对象 ID |
| status | string | pending / approved / rejected / cc / terminated |
| comment | text | 审批意见 |
| operator_id | integer | 实际处理人 ID |
| operator_name | string | 实际处理人姓名 |
| timeout_hours | integer | 超时小时数 |
| due_time | datetime | 截止时间 |
| timeout_notified | integer | 是否已提醒 |
| timeout_action | string | none / autoApprove / autoReject，超时后自动动作 |
| transferred_from | integer | 转办来源用户 ID |
| delegated_from | integer | 委托来源用户 ID |
| urge_count | integer | 催办次数 |
| last_urge_time | datetime | 上次催办时间 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### flow_delegations（流程委托表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| delegator_id | integer | 委托人 ID |
| delegatee_id | integer | 受托人 ID |
| flow_code | string | 限定流程编码，空表示全部 |
| start_time | datetime | 委托开始时间 |
| end_time | datetime | 委托结束时间 |
| status | integer | 1 启用 / 0 禁用 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

