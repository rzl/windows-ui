# 阶段十九：插件化扩展体系

## 目标

为低代码平台引入插件化扩展能力，使平台可通过「插件市场」安装、启用、停用插件，从而在不修改核心代码的情况下扩展：

1. **自定义字段类型**：数据模型设计器新增字段类型，影响物理列类型与表单/列表映射。
2. **自定义图表类型**：自定义页面设计器新增图表类型，独立渲染。
3. **自定义页面组件**：自定义页面设计器新增可拖拽组件，含设计时预览、运行时渲染、属性面板。

## 功能清单

### 1. 后端：插件元数据管理

- 新增 `lowcode_plugins` 表，存储插件编码、名称、版本、类型、贡献声明、运行时脚本、状态等。
- 新增 `/api/plugins` 管理接口：列表、详情、创建、更新、删除、启用、禁用。
- 新增 `/api/plugins/active` 公开接口：返回所有启用插件，供前端启动时拉取。
- 动态 CRUD 的物理列创建与数据清洗接入插件字段类型的 `dbType` 声明。

### 2. 前端：插件运行时与注册表

- `pluginManager.ts` 负责启动时拉取启用插件、执行 ES Module 运行时脚本、维护三类注册表：
  - `fieldTypeRegistry`：字段类型元数据。
  - `chartRegistry`：图表渲染器（内置默认 ECharts）。
  - `pageComponentRegistry`：页面组件定义。
- 模型设计器、低代码运行页接入字段类型注册表。
- 页面设计器、组件节点、属性面板、渲染器接入图表与页面组件注册表。

### 3. 前端：插件市场

- `PluginList.vue`：已安装插件列表，支持启用/禁用/删除/编辑。
- 内置两个示例插件：
  - `example-wordcloud`：词云图表。
  - `example-countdown`：倒计时组件。
- `PluginEditor.vue`：使用 Monaco 编辑器编辑插件元数据、`contributions` JSON 与运行时脚本。

### 4. 文档

- 新增 `sop/progress/phase-19.md`（本文件）。
- 新增 `sop/manuals/lowcode/plugin.md`：插件市场使用手册与插件开发指南。
- 更新 `sop/manuals/README.md`、`sop/lowcode/designer-spec.md`、`AGENTS.md` 索引。

## 数据表

### lowcode_plugins

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| code | varchar(50) UNIQUE | 插件编码 |
| name | varchar(100) | 插件名称 |
| version | varchar(20) | 版本号 |
| description | text | 描述 |
| type | varchar(20) | component / field / chart / mixed |
| contributions | json | 字段/图表/组件静态声明 |
| runtime_code | text | ES Module 运行时脚本 |
| runtime_url | varchar(500) | 可选外部脚本 URL |
| config_schema | json | 插件级配置 schema（预留） |
| status | tinyint | 0 禁用 / 1 启用 |
| icon | varchar(50) | 图标（预留） |
| author | varchar(100) | 作者（预留） |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/plugins | 插件列表（需登录） |
| GET | /api/plugins/active | 启用插件列表（公开） |
| GET | /api/plugins/:id | 插件详情（需登录） |
| POST | /api/plugins | 创建插件（需登录） |
| PUT | /api/plugins/:id | 更新插件（需登录） |
| DELETE | /api/plugins/:id | 删除插件（需登录） |
| POST | /api/plugins/:id/enable | 启用插件（需登录） |
| POST | /api/plugins/:id/disable | 禁用插件（需登录） |

## 插件包格式

```json
{
  "code": "example-plugin",
  "name": "示例插件",
  "version": "1.0.0",
  "description": "演示插件能力",
  "type": "mixed",
  "contributions": {
    "fieldTypes": [
      { "type": "rating", "label": "评分", "dbType": "integer", "formType": "number", "format": "number" }
    ],
    "charts": [
      { "type": "wordcloud", "label": "词云" }
    ],
    "components": [
      { "type": "countdown", "label": "倒计时", "category": "display", "icon": "clock" }
    ]
  },
  "runtimeCode": "export default function (api) { ... }"
}
```

运行时脚本可用 `api`：

- `api.h` / `api.defineComponent` / `api.ref` / `api.onMounted` / `api.computed` / `api.watch`
- `api.registerChart(def)`
- `api.registerComponent(def)`
- `api.registerFieldType(def)`

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260622020000_create_lowcode_plugins.ts` | 插件表迁移 |
| `packages/server/src/modules/plugin/plugin.service.ts` | 插件业务逻辑 |
| `packages/server/src/modules/plugin/plugin.controller.ts` | 插件 HTTP 控制器 |
| `packages/server/src/modules/plugin/plugin.routes.ts` | 插件路由 |
| `packages/lowcode-admin/src/api/plugin.ts` | 前端 API 封装 |
| `packages/lowcode-admin/src/utils/pluginManager.ts` | 插件管理器与三类注册表 |
| `packages/lowcode-admin/src/views/lowcode/PluginList.vue` | 插件市场列表 |
| `packages/lowcode-admin/src/views/lowcode/PluginEditor.vue` | 插件编辑页 |
| `sop/progress/phase-19.md` | 本阶段进度文档 |
| `sop/manuals/lowcode/plugin.md` | 插件市场用户手册 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/routes/index.ts` | 注册 `/plugins` 路由 |
| `packages/server/src/modules/lowcode/lowcode.service.ts` | 动态 CRUD 支持插件字段 dbType 与 sanitize |
| `packages/server/seeds/01_init_data.ts` | 新增「插件市场」菜单 |
| `packages/lowcode-admin/src/main.ts` | 启动时初始化插件 |
| `packages/lowcode-admin/src/router/index.ts` | 注册插件页面路由 |
| `packages/lowcode-admin/src/views/lowcode/ModelDesigner.vue` | 字段类型下拉使用注册表 |
| `packages/lowcode-admin/src/views/lowcode/LowcodePage.vue` | 表单控件映射使用注册表 |
| `packages/lowcode-admin/src/views/lowcode/PageDesigner.vue` | 组件面板与默认节点使用注册表 |
| `packages/lowcode-admin/src/components/page-designer/ComponentNode.vue` | 设计时预览支持插件组件 |
| `packages/lowcode-admin/src/components/page-designer/RenderComponent.vue` | 运行时渲染支持插件组件与图表注册表 |
| `packages/lowcode-admin/src/components/page-designer/PropertyEditor.vue` | 图表类型选择器与插件组件 JSON 编辑器 |
| `sop/manuals/README.md` | 手册目录索引 |
| `sop/lowcode/designer-spec.md` | 页面设计器 JSON 规范补充 |
| `AGENTS.md` | 低代码能力说明补充 |

## 任务清单

- [x] 数据库迁移：创建 `lowcode_plugins` 表
- [x] 后端：plugin service / controller / routes
- [x] 后端：注册 `/plugins` 路由
- [x] 后端：动态 CRUD 接入插件字段类型
- [x] 后端：种子菜单新增「插件市场」
- [x] 前端：`api/plugin.ts`
- [x] 前端：`pluginManager.ts` 与三类注册表
- [x] 前端：`main.ts` 启动初始化插件
- [x] 前端：字段类型注册表集成 ModelDesigner / LowcodePage
- [x] 前端：图表注册表集成页面设计器
- [x] 前端：页面组件注册表集成页面设计器
- [x] 前端：`PluginList.vue` 与 `PluginEditor.vue`
- [x] 前端：注册路由
- [x] 文档：阶段文档、用户手册、索引更新
- [x] 验证：迁移、运行、前后端构建

## 验收标准

1. [x] 管理员可进入「插件市场」页面，安装/启用/禁用/删除插件。
2. [x] 安装示例插件后，字段类型、图表类型、页面组件可在对应设计器中使用。
3. [x] 插件字段类型影响后端物理列创建与数据清洗。
4. [x] 保存的自定义页面可正确渲染插件组件/图表。
5. [x] 禁用插件后，设计器中不再显示该插件贡献的类型。
6. [x] `pnpm build:server` 与 `pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-22：完成阶段十九规划。
- 2026-06-22：完成后端插件表、模块、路由、动态 CRUD 集成与种子菜单。
- 2026-06-22：完成前端插件管理器、三类注册表、设计器集成、插件市场页面。
- 2026-06-22：完成文档与构建验证。

## 风险与待决策

1. **前端脚本安全**：插件运行时脚本在管理端执行，当前按管理员可信处理；后续若开放给普通用户安装，需引入 iframe 沙箱或 CSP。
2. **插件冲突**：同类型编码冲突时后者覆盖前者，建议插件编码使用 `vendor-type` 命名空间。
3. **表单自定义渲染**：MVP 中自定义字段类型映射到现有表单控件；若需要全新控件，后续需把 `dynamic-form.vue` 也接入注册表。
4. **运行时 URL**：当前支持 `runtime_url` 字段，但外部 URL 可能受 CORS 限制，生产环境建议托管到同域。
