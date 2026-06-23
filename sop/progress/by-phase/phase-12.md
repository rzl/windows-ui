# 阶段十二：应用市场示例模板

## 目标

在阶段十一「应用市场 + 角色应用授权」基础上，为低代码平台内置一批可直接安装的示例应用模板，实现一键创建完整应用（含数据模型、字段、表单、列表、流程、报表、仪表盘、打印模板），降低新用户上手成本。

## 功能清单

- **静态模板 JSON**：在 `packages/server/templates/apps/` 维护示例应用模板。
- **模板安装引擎**：后端统一编排，按依赖顺序创建所有实体，使用事务保证原子性。
- **模板市场入口**：应用市场新增"示例模板"标签页，支持安装模板。
- **应用管理入口**：应用列表页支持"从模板创建"。
- **自动发布与授权**：安装成功后自动发布应用菜单，并为当前用户角色授权该应用。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/templates/apps/customer-management.json` | 客户管理示例模板 |
| `packages/server/templates/apps/work-order-management.json` | 工单管理示例模板 |
| `packages/server/src/modules/app/template.service.ts` | 模板加载与安装引擎 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/app/app.service.ts` | 导出 `publishAppMenus`，新增 `grantAppToRole` |
| `packages/server/src/modules/app/app.controller.ts` | 新增 `getAppTemplates`、`createAppFromTemplate` |
| `packages/server/src/modules/app/app.routes.ts` | 新增 `/apps/templates`、`/apps/create-from-template` 路由 |
| `packages/lowcode-admin/src/api/app.ts` | 新增 `getAppTemplates`、`createAppFromTemplate` |
| `packages/lowcode-admin/src/views/lowcode/AppMarket.vue` | 新增模板标签页与安装对话框 |
| `packages/lowcode-admin/src/views/lowcode/AppList.vue` | 新增"从模板创建"按钮与对话框 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/apps/templates | 列出可用示例模板 |
| POST | /api/apps/create-from-template | 从模板创建应用 |

### POST /api/apps/create-from-template

请求体：

```json
{
  "template": "customer-management",
  "code": "customer",
  "name": "客户管理",
  "autoPublish": true
}
```

响应：

```json
{
  "appId": 1,
  "code": "customer",
  "name": "客户管理",
  "versionId": 1,
  "autoPublish": true
}
```

## 模板 JSON 结构

```json
{
  "template": "customer-management",
  "version": "1.0.0",
  "app": { "name": "", "category": "", "icon": "", "description": "" },
  "items": [{ "type": "model|report|dashboard|flow|print|datasource", "refCode": "", "refName": "", "sort": 0 }],
  "dicts": [{ "code": "", "name": "", "items": [...] }],
  "codingRules": [{ "code": "", "name": "", "prefix": "", "dateFormat": "YYYYMMDD", "seqLength": 4 }],
  "validationRules": [{ "code": "", "name": "", "pattern": "", "message": "" }],
  "models": [{ "code": "", "name": "", "tableName": "", "fields": [...], "form": {...}, "table": {...} }],
  "flows": [{ "code": "", "name": "", "modelCode": "", "config": {...} }],
  "reports": [{ "code": "", "name": "", "modelCode": "", "config": {...} }],
  "dashboards": [{ "code": "", "name": "", "config": {...} }],
  "prints": [{ "code": "", "name": "", "modelCode": "", "config": {...} }],
  "pages": [{ "code": "", "name": "", "config": {...} }],
  "datasources": []
}
```

## 安装流程

1. 读取模板 JSON。
2. 生成目标应用编码（自动去重）。
3. 建立 code 映射表：模型、报表、仪表盘、打印模板、流程、外部数据源、字典、规则等。
4. 按依赖顺序创建实体：
   - 字典 → 编码规则 → 校验规则
   - 数据模型 → 字段 → 物理表列 → 表单/列表
   - 外部数据源 → 流程 → 报表 → 仪表盘 → 打印模板
5. 创建应用、应用项、版本快照。
6. 自动发布应用并生成菜单。
7. 为当前用户角色写入 `role_apps` 授权记录。

## 任务清单

- [x] 设计模板 JSON Schema
- [x] 创建示例模板文件（客户管理、工单管理）
- [x] 后端：实现 `template.service.ts`（加载 + 安装引擎）
- [x] 后端：新增 `/api/apps/templates`、`/api/apps/create-from-template` 接口
- [x] 后端：导出 `publishAppMenus` 并新增 `grantAppToRole`
- [x] 前端：API 层新增模板相关方法
- [x] 前端：改造 `AppMarket.vue` 展示并安装模板
- [x] 前端：`AppList.vue` 增加"从模板创建"入口
- [x] 文档：编写阶段十二进度文档与应用模板使用手册
- [x] 验证：迁移、运行、构建

## 验收标准

1. [x] 应用市场"示例模板"标签页展示客户管理、工单管理两个模板。
2. [x] 点击"安装"可弹出配置对话框，安装成功后跳转应用运行页。
3. [x] 安装完成后数据库中生成完整的模型、字段、表单、列表、流程、报表、仪表盘、打印模板记录。
4. [x] 安装完成后侧边栏自动生成该应用菜单，当前用户可立即看到并进入。
5. [x] 重复安装同一模板时，应用编码自动追加后缀（如 `customer_1`）。
6. [x] 安装失败时事务回滚，不留下脏数据。
7. [x] `pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-18：制定阶段十二计划并获批准。
- 2026-06-18：创建客户管理、工单管理示例模板 JSON。
- 2026-06-18：实现后端模板安装引擎与接口。
- 2026-06-18：完成前端应用市场模板展示、安装对话框、应用列表"从模板创建"。
- 2026-06-18：编写阶段文档与用户手册，完成构建与运行验证。
