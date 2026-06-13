# 数据库设计

> 默认使用 SQLite，所有表结构使用 Knex 迁移管理。字段命名采用 snake_case，JavaScript 层使用 camelCase 转换。

## 核心表

### users（用户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| username | string UNIQUE | 用户名 |
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
| name | string | 角色名称 |
| code | string UNIQUE | 角色编码 |
| description | string | 描述 |
| status | integer | 0 禁用 / 1 启用 |
| create_time | datetime | 创建时间 |

### menus（菜单表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
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
| role_id | integer FK | 角色 ID |
| permission | string | 权限码 |

### depts（部门表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| parent_id | integer FK | 父部门 ID |
| name | string | 部门名称 |
| code | string | 部门编码 |
| sort | integer | 排序 |
| status | integer | 0 禁用 / 1 启用 |

### dicts（字典表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| name | string | 字典名称 |
| code | string UNIQUE | 字典编码 |
| description | string | 描述 |
| status | integer | 0 禁用 / 1 启用 |

### dict_items（字典项表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer PK | 自增主键 |
| dict_id | integer FK | 字典 ID |
| label | string | 显示标签 |
| value | string | 值 |
| sort | integer | 排序 |
| status | integer | 0 禁用 / 1 启用 |

## 后续扩展表

- `tenants`：租户表
- `tenant_packages`：租户套餐
- `data_sources`：多数据源配置
- `white_lists`：白名单
- `third_party_configs`：第三方配置
- `announcements`：系统公告
- `jobs`：定时任务
- `messages` / `message_templates`：消息中心
- `operation_logs`：操作日志
- `data_logs`：数据变更日志
- `lowcode_models` / `lowcode_fields` / `lowcode_forms` / `lowcode_tables`：低代码元数据
