# 低代码平台开发工作流程

> 本文档规定基于 `windows-ui` 组件库开发低代码管理平台的标准流程，覆盖需求分析、组件评估、实现、文档、示例、提交与交付全过程。

---

## 一、总体流程

```
需求/任务 -> 组件评估 -> 实现 -> 文档同步 -> 示例补充 -> 验证 -> 提交 -> 推送
```

每个阶段必须产出可追踪的文档或代码变更。

---

## 二、阶段说明

### 1. 需求分析与组件评估

接到新功能或优化任务后，先回答以下问题：

| 问题 | 评估结果 | 处理方式 |
|---|---|---|
| 现有 `windows-ui` 组件能否满足交互需求？ | 能 | 直接复用 |
| 现有组件功能接近但缺少必要能力？ | 基本能 | 扩展组件，保持 API 兼容 |
| 现有组件完全不满足？ | 不能 | 新增通用组件，补齐三份文档 |

**禁止直接写死样式或复制组件代码到低代码业务页面中。** 通用能力必须沉淀到 `packages/windows-ui` 组件库。

### 2. 组件扩展规范

当需要扩展组件时，按以下规范执行：

1. **最小修改**：只增加必要 Props / Events / Slots，不破坏现有行为。
2. **类型完整**：TS 类型声明与运行时行为一致。
3. **样式一致**：优先使用 `variables.css` 变量；XP 经典渐变除外。
4. **命名规范**：
   - Props：小驼峰，如 `searchable`、`searchCollapsible`
   - 事件：`search`、`reset`、`page-change`
   - Slot：`search`、`toolbar`、`action`
5. **文档同步**：修改后必须同步更新：
   - `docs/<component>/usage.md` — 用法、Props、Events、Slots
   - `designs/<component>/design.md` — 视觉、交互、可访问性
   - `develops/<component>/progress.md` — 实现清单、变更记录
6. **示例页面**：在 `packages/playground/src/pages/components/` 补充或更新演示页面，并在 `router/index.ts` 与 `Layout.vue` 导航中注册。

### 3. 低代码业务页面开发

开发 `packages/lowcode-admin` 中的业务页面时：

1. **优先使用已有通用组件**：
   - `WCrudTable`：列表页标准模板
   - `WDynamicForm`：动态表单渲染
   - `WQueryBuilder`：多条件查询
2. **交互抽象**：同一类交互出现两次以上，应封装为 composable 或业务组件，放到 `packages/lowcode-admin/src/composables/` 或 `components/`。
3. **API 层统一**：所有请求通过 `src/api/` 下的模块管理，禁止在页面中直接写 `axios`。
4. **权限控制**：按钮级权限使用路由 meta + 角色判断；数据权限由后端控制。

### 4. 后端开发

1. **分层清晰**：routes → controller → service → db
2. **统一响应**：使用 `utils/response.ts` 中的 `success()` / `error()`
3. **错误处理**：使用 `AppError` 抛出业务错误，由统一错误中间件处理
4. **数据库变更**：
   - 新建表：写迁移文件到 `packages/server/migrations/`
   - 修改表：新建迁移文件，禁止直接修改已执行过的迁移
   - 初始化数据：写到 `packages/server/seeds/`
5. **低代码动态 API**：新增/修改动态 CRUD 行为时，同步更新 `sop/lowcode/dynamic-api.md`；新增自定义接口时，同步更新 `sop/lowcode/dynamic-api.md` 与 `sop/manuals/lowcode/custom-api.md`

### 5. 文档同步要求

每完成一个功能，必须同步以下文档：

| 文档类型 | 路径 | 内容 |
|---|---|---|
| 组件使用文档 | `docs/<component>/usage.md` | Props、Events、Slots、示例 |
| 组件设计文档 | `designs/<component>/design.md` | 分类、视觉、交互、可访问性 |
| 组件开发进度 | `develops/<component>/progress.md` | 实现清单、待优化、变更记录 |
| 用户操作手册 | `sop/manuals/**` | 面向最终用户的操作步骤 |
| 架构/规范文档 | `sop/architecture/`、`sop/development/` | 系统架构、开发流程、重构依据 |
| 低代码设计文档 | `sop/lowcode/` | 元数据、API、设计器规范 |

### 6. 验证

提交前必须执行：

```bash
pnpm build:lowcode              # 验证低代码前端构建
pnpm build:server               # 验证后端 TypeScript 编译
pnpm --filter @windows-ui/core test  # 验证 UI 库单元测试
```

如有条件，再启动 `pnpm dev:server` 与 `pnpm dev:lowcode` 进行功能联调。

### 测试规范

- UI 库组件使用 Vitest + `@vue/test-utils` 编写单元测试。
- 测试文件与组件同目录，命名为 `<component>.spec.ts`。
- 每新增通用组件必须同步编写测试，覆盖渲染、Props、事件、关键交互。

### 7. Git 提交

1. **提交粒度**：按模块/功能分多次 commit，避免一次性大提交。
2. **提交信息**：遵循 `<type>(<scope>): <subject>` 格式
   - `feat`: 新功能
   - `fix`: 修复
   - `docs`: 文档
   - `refactor`: 重构
   - `chore`: 工程化/依赖
3. **提交后推送**：本地验证通过后立即 `git push`，保持远程同步。

---

## 三、重构与进度跟踪

### 重构依据

重构前必须阅读以下文档：

- `sop/architecture/overview.md` — 整体架构
- `sop/architecture/frontend.md` — 前端分层
- `sop/architecture/backend.md` — 后端分层
- `sop/database/schema.md` — 数据库设计
- `sop/lowcode/*.md` — 低代码平台核心设计
- `sop/progress/phase-*.md` — 各阶段实现清单

### 进度跟踪

- 每个阶段创建/更新 `sop/progress/phase-*.md`
- 任务完成后勾选实现清单
- 待优化项不删除，持续跟踪

---

## 四、 checklist

每次开发任务完成后对照检查：

- [ ] 组件能力已沉淀到 `packages/windows-ui`，而非写在业务页面
- [ ] 组件文档三件套（usage/design/progress）已更新
- [ ] playground 示例页面已补充
- [ ] 用户操作手册已补充
- [ ] 后端 API / 数据库变更已记录到 SOP
- [ ] `pnpm build:lowcode` 通过
- [ ] `pnpm build:server` 通过
- [ ] `pnpm --filter @windows-ui/core test` 通过
- [ ] 已提交 git 并推送远程
