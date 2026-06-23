# 阶段十四：自定义页面设计器（Page Designer）

## 目标

补齐低代码平台中预留的 `page` 类型应用项，实现独立的自定义页面能力：用户可通过拖拽组件自由组合布局、数据与交互，生成自定义页面；页面可作为应用资源被引用、随应用发布，并在应用运行门户中访问。

## 功能清单

- **自定义页面管理**：新增 `lowcode_pages` 表，支持页面 CRUD。
- **后端 page 模块**：独立的 service / controller / routes，提供页面查询、保存、删除与数据源执行接口。
- **拖拽式页面设计器**：左侧组件库、中间画布、右侧属性面板；支持拖拽添加组件、选中编辑、上移/下移/删除、容器嵌套子组件。
- **页面运行器**：根据页面配置递归渲染组件，支持文本、统计卡片、图表、公告、按钮、链接、容器、卡片、栅格、标签页，以及嵌入数据模型/仪表盘/报表。
- **应用集成**：页面可作为 `AppItem` 加入应用，随应用版本快照、发布菜单；应用运行门户支持点击页面资源入口跳转。
- **模板安装支持**：模板 JSON 支持 `pages` 数组，安装时自动创建页面并重写跨引用编码。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260619010000_create_lowcode_pages.ts` | 创建 `lowcode_pages` 表 |
| `packages/server/migrations/20260619010100_add_page_menu.ts` | 新增「自定义页面」菜单 |
| `packages/server/src/modules/page/page.service.ts` | 页面业务逻辑 |
| `packages/server/src/modules/page/page.controller.ts` | 页面 HTTP 控制器 |
| `packages/server/src/modules/page/page.routes.ts` | 页面路由注册 |
| `packages/lowcode-admin/src/api/page.ts` | 页面 API 封装 |
| `packages/lowcode-admin/src/views/lowcode/PageList.vue` | 页面列表页 |
| `packages/lowcode-admin/src/views/lowcode/PageDesigner.vue` | 页面设计器 |
| `packages/lowcode-admin/src/views/lowcode/PageRunner.vue` | 页面运行器 |
| `packages/lowcode-admin/src/components/page-designer/ComponentNode.vue` | 画布组件节点 |
| `packages/lowcode-admin/src/components/page-designer/PropertyEditor.vue` | 属性编辑器 |
| `packages/lowcode-admin/src/components/page-designer/DataSourceEditor.vue` | 数据源配置编辑器 |
| `packages/lowcode-admin/src/components/page-designer/PageRenderer.vue` | 页面渲染入口 |
| `packages/lowcode-admin/src/components/page-designer/RenderComponent.vue` | 递归组件渲染器 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/routes/index.ts` | 注册 `/pages` 路由 |
| `packages/server/src/modules/app/app.service.ts` | `buildMenuItem` 新增 `page` 分支 |
| `packages/server/src/modules/app/template.service.ts` | 模板安装支持 `pages` 数组与编码重写 |
| `packages/lowcode-admin/src/router/index.ts` | 新增 `/lowcode/page`、`/lowcode/page-design/:code`、`/lowcode/page-run/:code` 路由 |
| `packages/lowcode-admin/src/views/lowcode/AppDesigner.vue` | 资源面板新增「页面」Tab，并修复内部 `w-tabs` 因 `w-tab-pane` 未注册导致 Tab 头部为空的问题 |
| `packages/lowcode-admin/src/views/lowcode/AppRunner.vue` | `enterResource` 新增 `page` 分支 |
| `packages/lowcode-admin/src/api/app.ts` | `AppForm` 增加 `portalConfig` 字段声明 |
| `packages/lowcode-admin/src/views/dashboard/Dashboard.vue` | 修复 `v-for` 中未使用的 `index` 变量 |

## 数据结构

### 页面配置（PageConfig）

```json
{
  "title": "页面标题",
  "description": "页面描述",
  "components": [
    {
      "id": "comp_xxx",
      "type": "text",
      "props": { "content": "Hello Page", "tag": "p", "align": "left" },
      "styles": { "marginTop": "12px" },
      "dataSource": { "type": "static", "value": "" },
      "events": { "onClick": { "action": "navigate", "target": "" } }
    }
  ]
}
```

### 组件类型

| 分类 | 类型 |
|------|------|
| 布局 | container、card、grid、tabs |
| 展示 | text、stat、chart、notice |
| 数据 | model、dashboard、report |
| 交互 | button、link |

### 数据源类型

| type | 说明 |
|------|------|
| static | 静态值 |
| sql | 只读 SELECT 查询，可附加 transformScript |
| api | 内部接口调用，可附加 transformScript |
| script | 在线 JS 脚本，可调用 `db.raw()` 与 `http()` |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/pages/pages | 列出所有页面 |
| GET | /api/pages/pages/:code | 根据编码获取页面 |
| POST | /api/pages/pages | 创建/更新页面 |
| DELETE | /api/pages/pages/:id | 删除页面 |
| POST | /api/pages/pages/:code/execute | 执行页面数据源 |

## 任务清单

- [x] 数据库迁移：创建 `lowcode_pages` 表与菜单
- [x] 后端：实现 page 模块 CRUD 与数据源执行
- [x] 后端：`app.service.ts` 支持 `page` 类型菜单
- [x] 后端：`template.service.ts` 支持安装模板中的 `pages`
- [x] 前端：页面列表 `PageList.vue`
- [x] 前端：拖拽式页面设计器 `PageDesigner.vue`
- [x] 前端：页面运行器 `PageRunner.vue`
- [x] 前端：页面设计器子组件（ComponentNode、PropertyEditor、DataSourceEditor、PageRenderer、RenderComponent）
- [x] 前端：`AppDesigner.vue` 集成页面资源 Tab
- [x] 前端：`AppRunner.vue` 支持 page 资源入口
- [x] 前端：新增页面相关路由
- [x] 文档：同步阶段十四进度文档、页面设计器使用手册、配置规范、数据库 schema
- [x] 验证：迁移、运行、前后端构建

## 验收标准

1. [x] 「自定义页面」菜单正常显示，页面列表可增删改查。
2. [x] 页面设计器可拖拽添加组件，选中后右侧属性面板可编辑。
3. [x] 容器/卡片/栅格/标签页支持嵌套子组件。
4. [x] 页面运行器可正确渲染配置的组件树。
5. [x] 统计卡片、图表支持 static/sql/api/script 数据源。
6. [x] 应用设计器可将页面添加为应用资源。
7. [x] 应用发布后，菜单自动生成包含页面子菜单。
8. [x] 应用运行门户中点击页面资源可跳转到页面运行器。
9. [x] 模板 JSON 支持 `pages` 数组，安装后页面编码冲突自动去重。
10. [x] `pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-18：制定阶段十四计划，用户选择「可视化拖拽式页面设计器」方案。
- 2026-06-18：完成后端 `lowcode_pages` 表迁移与 page 模块。
- 2026-06-18：完成前端页面列表、设计器、运行器及设计器子组件。
- 2026-06-18：完成应用设计器/运行器集成与页面路由注册。
- 2026-06-18：完成模板安装对 `pages` 的支持。
- 2026-06-18：运行迁移，通过浏览器验证页面设计、运行、应用集成全流程。
- 2026-06-18：编写并同步阶段文档、使用手册、配置规范、数据库 schema。
