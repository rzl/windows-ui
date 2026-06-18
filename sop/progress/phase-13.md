# 阶段十三：应用运行门户 / 工作台

## 目标

将低代码平台中仅展示资源列表的 `AppRunner.vue` 升级为**可配置的应用运行门户/工作台**，让应用所有者能够为每个应用自定义首页，同时保留原有的"资源列表"视图作为可选模式。

## 功能清单

- **应用级门户配置**：每个应用可独立配置 `portalConfig`，支持 `list`（资源列表）和 `portal`（工作台）两种模式。
- **工作台 Widget 组件**：统计卡片、快捷链接、仪表盘、公告、流程待办、应用资源快捷入口。
- **通用 Widget 组件库**：从 `Dashboard.vue` 抽取通用 widget 组件，首页门户与应用门户复用。
- **应用设计器门户配置 Tab**：在 `AppDesigner.vue` 中新增"门户配置"标签页，可视化配置 widget。
- **仪表盘独立运行路由**：新增 `/dashboard/run/:code`，修复应用运行页点击仪表盘 404 的问题。
- **示例模板默认门户**：客户管理、工单管理示例模板安装后默认以工作台门户形式运行。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260619000000_add_portal_config_to_apps.ts` | 为 `lowcode_apps` 表新增 `portal_config` 字段 |
| `packages/lowcode-admin/src/components/portal/StatWidget.vue` | 统计卡片 widget |
| `packages/lowcode-admin/src/components/portal/LinkWidget.vue` | 快捷链接 widget |
| `packages/lowcode-admin/src/components/portal/DashboardWidget.vue` | 仪表盘 iframe widget |
| `packages/lowcode-admin/src/components/portal/NoticeWidget.vue` | 公告 widget |
| `packages/lowcode-admin/src/components/portal/PendingTaskWidget.vue` | 流程待办 widget |
| `packages/lowcode-admin/src/components/portal/AppResourceWidget.vue` | 应用资源快捷入口 widget |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/app/app.service.ts` | 扩展 `AppForm`，支持 `portalConfig` 读写；快照/回滚/导入导出兼容 |
| `packages/server/src/modules/app/template.service.ts` | 模板安装时保留 `portalConfig` |
| `packages/lowcode-admin/src/views/dashboard/Dashboard.vue` | 使用通用 widget 组件；支持 `/dashboard/run/:code` 运行模式 |
| `packages/lowcode-admin/src/views/lowcode/AppRunner.vue` | 支持 list/portal 双模式渲染工作台 |
| `packages/lowcode-admin/src/views/lowcode/AppDesigner.vue` | 新增"门户配置"Tab |
| `packages/lowcode-admin/src/router/index.ts` | 新增 `/dashboard/run/:code` 路由 |
| `packages/server/templates/apps/customer-management.json` | 增加默认门户配置 |
| `packages/server/templates/apps/work-order-management.json` | 增加默认门户配置 |

## 数据结构

### portalConfig

```json
{
  "mode": "portal",
  "showResources": true,
  "widgets": [
    { "type": "stat", "title": "客户总数", "field": "customerCount", "icon": "customer", "color": "primary", "dataSource": { "type": "sql", "sql": "SELECT COUNT(*) AS value FROM lc_customer" } },
    { "type": "link", "title": "进入客户列表", "path": "/lowcode/run/customer", "icon": "arrow-right", "color": "primary" },
    { "type": "dashboard", "title": "客户等级分布", "dashboardCode": "customer_dashboard" },
    { "type": "notice", "title": "公告", "content": "欢迎使用客户管理应用" },
    { "type": "pending-task", "title": "待办审批", "limit": 5, "icon": "flow", "color": "warning" },
    { "type": "app-resources", "title": "快捷入口", "limit": 8, "icon": "app", "color": "primary" }
  ]
}
```

## 任务清单

- [x] 数据库迁移：新增 `lowcode_apps.portal_config`
- [x] 后端 app.service 扩展 portalConfig 读写
- [x] 模板安装保留 portalConfig
- [x] 抽取 6 个通用 portal widget 组件
- [x] 改造 `Dashboard.vue` 使用 widget 组件
- [x] 改造 `AppRunner.vue` 支持 list/portal 双模式
- [x] 新增 `AppDesigner.vue` 门户配置 Tab
- [x] 新增 `/dashboard/run/:code` 路由并改造 `Dashboard.vue`
- [x] 为示例模板添加默认门户配置
- [x] 文档：编写阶段十三进度文档与应用门户使用手册
- [x] 验证：迁移、运行、构建

## 验收标准

1. [x] 应用设计器新增"门户配置" Tab，可配置视图模式和 widget。
2. [x] `AppRunner.vue` 根据 `portalConfig.mode` 正确切换列表/工作台视图。
3. [x] 工作台模式下正确渲染 stat / link / dashboard / notice / pending-task / app-resources widget。
4. [x] 首页门户（`Dashboard.vue`）行为保持不变，且使用通用 widget 组件。
5. [x] 应用运行页点击仪表盘资源跳转到 `/dashboard/run/:code`，不再 404。
6. [x] 客户管理、工单管理模板安装后默认展示工作台门户。
7. [x] 应用快照/回滚/导入导出保留门户配置。
8. [x] `pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-18：制定阶段十三计划并获批准。
- 2026-06-18：完成后端 `portal_config` 字段与接口扩展。
- 2026-06-18：完成 6 个通用 widget 组件抽取与 `Dashboard.vue` 改造。
- 2026-06-18：完成 `AppRunner.vue` 双模式改造与 `AppDesigner.vue` 门户配置 Tab。
- 2026-06-18：完成仪表盘独立运行路由与示例模板默认门户配置。
- 2026-06-18：编写文档，完成构建与运行验证。
