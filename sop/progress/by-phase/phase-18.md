# 阶段十八：在线 Monaco 接口编辑器

## 目标

在低代码平台中新增「自定义接口」能力：管理员可通过 Monaco 编辑器在线编写 JavaScript 脚本，脚本可调用数据库、内部 HTTP 接口、接收请求参数，并返回自定义数据结构；保存后即可通过 `/api/custom/*` 多层路径动态调用，默认需要登录，也可配置为公开访问。

## 功能清单

### 1. Monaco Editor 落地（iframe 方案）

- 安装 `monaco-editor` 依赖。
- 创建 `packages/lowcode-admin/public/monaco-editor.html`，iframe 内加载 Monaco。
- 通过 `postinstall` 脚本将 Monaco 资源复制到 `public/monaco-editor/min`。
- 复用 `WMonacoEditor` 组件的 iframe 封装。

### 2. 后端：自定义接口模块

- 新增 `lowcode_custom_apis` 表：编码、名称、方法、路径、脚本、状态、是否公开等字段。
- 新增 `custom-api` 模块：service / controller / routes。
- 抽取公共脚本沙箱执行器 `utils/script-runner.ts`，基于 `vm2`。
- 改造 `dashboard.service.ts` 复用公共执行器。
- 动态调用路由 `/api/custom/*`，使用 `optionalAuthMiddleware`；非公开接口校验登录。

### 3. 前端：自定义接口管理

- 新增 `CustomApiList.vue` 列表页。
- 新增 `CustomApiEditor.vue` 编辑/测试页，集成 Monaco 编辑器。
- 新增 `customApi.ts` API 封装。
- 注册前端路由。

### 4. 文档与种子

- 新增 `sop/manuals/lowcode/custom-api.md` 用户手册。
- 新增 `sop/progress/phase-18.md` 阶段进度文档。
- 在种子中新增「自定义接口」菜单与权限码。

## 数据表

### lowcode_custom_apis

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| code | varchar(50) UNIQUE | 接口编码 |
| name | varchar(50) | 接口名称 |
| method | varchar(10) | GET / POST / PUT / DELETE / ALL |
| path | varchar(255) | 调用路径，支持多层结构 |
| description | text | 描述 |
| script | text | Monaco 编辑的脚本 |
| status | tinyint | 0 禁用 / 1 启用 |
| is_public | tinyint | 0 需登录（默认）/ 1 公开 |

## 接口约定

### 管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/custom-apis | 列表 |
| GET | /api/custom-apis/:id | 详情 |
| POST | /api/custom-apis | 创建 |
| PUT | /api/custom-apis/:id | 更新 |
| DELETE | /api/custom-apis/:id | 删除 |
| POST | /api/custom-apis/:id/test | 测试执行 |

### 动态调用接口

| 方法 | 路径 | 说明 |
|------|------|------|
| ALL | /api/custom/* | 按路径执行脚本，支持多层路径 |

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260622010000_create_lowcode_custom_apis.ts` | 自定义接口表迁移 |
| `packages/server/src/modules/custom-api/custom-api.service.ts` | 业务逻辑 |
| `packages/server/src/modules/custom-api/custom-api.controller.ts` | HTTP 控制器 |
| `packages/server/src/modules/custom-api/custom-api.routes.ts` | 管理接口路由 |
| `packages/server/src/utils/script-runner.ts` | vm2 公共脚本执行器 |
| `packages/lowcode-admin/public/monaco-editor.html` | Monaco iframe 页面 |
| `packages/lowcode-admin/src/api/customApi.ts` | 前端 API 封装 |
| `packages/lowcode-admin/src/views/lowcode/CustomApiList.vue` | 接口列表 |
| `packages/lowcode-admin/src/views/lowcode/CustomApiEditor.vue` | 接口编辑/测试 |
| `sop/manuals/lowcode/custom-api.md` | 用户手册 |
| `sop/progress/phase-18.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/routes/index.ts` | 注册 `/custom-apis` 与 `/custom/*` |
| `packages/server/src/modules/dashboard/dashboard.service.ts` | 复用 `script-runner.ts` |
| `packages/lowcode-admin/package.json` | 新增 `monaco-editor` 与 `postinstall` |
| `packages/lowcode-admin/src/router/index.ts` | 注册自定义接口页面路由 |
| `packages/server/seeds/01_init_data.ts` | 新增菜单与权限码 |
| `AGENTS.md` | 补充自定义接口到低代码能力说明与 SOP 索引 |
| `docs/monaco-editor/usage.md` | 更新 WMonacoEditor Props 与说明 |
| `designs/monaco-editor/design.md` | 更新交互设计说明 |
| `develops/monaco-editor/progress.md` | 更新变更记录 |
| `sop/lowcode/README.md` | 添加自定义接口文档索引 |
| `sop/lowcode/dynamic-api.md` | 补充自定义接口链接 |
| `sop/manuals/README.md` | 添加自定义接口到手册目录 |
| `sop/development/workflow.md` | 补充自定义接口文档同步要求 |

## 任务清单

- [x] 安装 `monaco-editor` 与 `vm2`
- [x] 创建 `public/monaco-editor.html` 与资源复制脚本
- [x] 数据库迁移：创建 `lowcode_custom_apis`
- [x] 后端：抽取 `script-runner.ts`（vm2）
- [x] 后端：改造 `dashboard.service.ts`
- [x] 后端：`custom-api` 模块
- [x] 后端：注册 `/custom-apis` 与 `/custom/*`
- [x] 前端：`customApi.ts` API 封装
- [x] 前端：`CustomApiList.vue` 与 `CustomApiEditor.vue`
- [x] 前端：注册路由
- [x] 文档：用户手册与阶段进度
- [x] 种子：新增菜单与权限码
- [x] 验证：迁移、运行、前后端构建

## 验收标准

1. [x] 管理员可进入自定义接口页面，使用 Monaco 编辑器编写脚本。
2. [x] 脚本中可调用 `db.raw()`、`http()`、`axios` 并返回 JSON。
3. [x] 保存后可通过 `/api/custom/user/stats` 等多层路径调用。
4. [x] 接口支持 GET / POST / PUT / DELETE / ALL 方法。
5. [x] 默认接口需要登录；公开接口无需登录。
6. [x] 编辑页可模拟参数并查看测试结果。
7. [x] 禁用的接口返回 404/403。
8. [x] `pnpm build:server` 与 `pnpm build:lowcode` 通过。

## 运行记录

- 2026-06-20：安装 monaco-editor、vm2，创建 Monaco iframe 页面与复制脚本。
- 2026-06-20：完成后端迁移、script-runner、custom-api 模块、路由注册。
- 2026-06-20：完成前端列表、编辑、测试页面与路由。
- 2026-06-20：同步更新用户手册、阶段文档、种子菜单。
- 2026-06-20：运行迁移与前后端构建验证。

## 风险与待决策

1. **脚本安全**：vm2 沙箱仍暴露网络与数据库读取能力；公开接口需特别谨慎，后续可增加调用频率限制、IP 白名单。
2. **Monaco 资源体积**：iframe 方案会复制 Monaco 到 public，构建产物增加数 MB；可考虑按页面懒加载。
3. **路径冲突**：`/api/custom/*` 为通配路由，需避免与后续新增路由冲突。
4. **脚本超时**：当前固定 5 秒超时，后续可改为按接口配置。
