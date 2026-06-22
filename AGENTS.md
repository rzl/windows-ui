<!-- From: /data/data/com.termux/files/home/git/windows-ui/AGENTS.md -->
# Windows UI — Agent 项目指南

> 本文档面向 AI 编程助手。如果你从未接触过本项目，请先阅读本文件再修改代码。

---

## 项目概览

**Windows UI** 是一个受 Windows XP 经典风格启发的 Vue 3 UI 组件库，并围绕该组件库搭建了示例站点、Admin 后台模板、低代码管理平台前端及其配套后端服务。

- **技术栈**：
  - UI 库 / 前端：Vue 3（Composition API / `<script setup>`）、TypeScript 5.3+、Vite 5.0+
  - 状态管理：Pinia 3.0+
  - 路由 / 国际化：vue-router 4.6+、vue-i18n 11.4+（playground 与 Admin 子应用使用）
  - 低代码流程设计：@vue-flow/core 等（`packages/lowcode-admin`）
  - 后端：Node.js + Express 4.19+ + TypeScript 5.4+ + Knex 3.1+ + SQLite3 5.1+
  - 包管理：pnpm workspaces
- **工作区包**：
  - `@windows-ui/core`：组件库源码，位于 `packages/windows-ui`
  - `@windows-ui/playground`：组件文档与示例站点，内部同时包含一个 Admin 后台模板子应用
  - `@windows-ui/lowcode-admin`：低代码管理平台前端
  - `@windows-ui/server`：低代码管理平台后端服务
- **组件数量**：`packages/windows-ui/src/components/` 下共有 **91 个组件目录**、**94 个 `.vue` 单文件组件**；在 `packages/windows-ui/src/index.ts` 中全局注册并 named export 的组件为 **92 个**（`form/` 目录同时提供 `WForm` 与 `WFormItem`；`menu/sub-menu.vue`、`tree/tree-node.vue` 为内部子组件，不对外注册）
- **默认前缀**：`w-`（例如 `w-button`），可通过 `WConfigProvider` 自定义
- **主题系统**：基于 CSS 变量（`--w-*`），`WConfigProvider` 支持动态传入主题色并自动计算色阶（lighter / light / dark / darker）以及标题栏渐变，同时保留 XP 经典硬编码渐变以保证视觉一致性
- **国际化**：内置 `zh-CN` / `en-US` 语言包，语言文件为单层键值对；支持通过 `WConfigProvider` 局部配置或 `app.use(WindowsUI, { locale, messages })` 全局配置，组件内部通过 `useLocale()` 获取翻译函数
- **原始需求**：见仓库根目录 `1.text`（只读参考）

---

## 仓库结构

```
windows-ui/
├── package.json                 # 根 package.json，定义 workspace 与顶层脚本
├── pnpm-workspace.yaml          # pnpm 工作区：packages/*
├── .npmrc                       # pnpm 配置（verify-deps-before-run=false 等）
├── 1.text                       # 原始需求文档（只读参考）
│
├── packages/
│   ├── windows-ui/              # 📦 UI 库源码（@windows-ui/core）
│   │   ├── src/
│   │   │   ├── index.ts         # 统一入口：注册全部组件 + install 方法 + 按需导出
│   │   │   ├── styles/
│   │   │   │   ├── variables.css    # CSS 变量（XP 配色、字体、阴影、尺寸等）
│   │   │   │   └── base.css         # XP 基础工具类（按钮、输入框、窗口、滚动条等）
│   │   │   ├── utils/
│   │   │   │   ├── prefix.ts        # 组件前缀注入 / usePrefix() / useGlobalSize()
│   │   │   │   └── types.ts         # 公共类型（ComponentSize、ConfigProviderContext）
│   │   │   ├── hooks/               # 组合式函数目录（当前为空，预留）
│   │   │   ├── locale/              # 国际化：语言包 / useLocale() / setGlobalLocale() / registerLocale()
│   │   │   │   ├── lang/            # 内置语言文件（单层键值对）
│   │   │   │   └── index.ts         # locale 上下文注入与 API 导出
│   │   │   └── components/
│   │   │       └── <name>/
│   │   │           └── <name>.vue   # 单文件组件（SFC），每个组件一个目录一个文件
│   │   ├── vite.config.ts       # Vite lib 模式构建配置（ES + UMD + d.ts）
│   │   ├── vitest.config.ts     # Vitest 单元测试配置
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── playground/              # 🎨 示例与文档站点（同时包含 Admin 后台模板子应用）
│   │   ├── src/
│   │   │   ├── main.ts          # 入口：createApp + use(WindowsUI) + router + vue-i18n
│   │   │   ├── App.vue
│   │   │   ├── router/index.ts  # hash 路由，覆盖全部组件独立页面 + 分类首页 + 首页
│   │   │   ├── views/Layout.vue # 侧边栏 + 内容区布局，含全局尺寸 / 主题色 / 语言切换控件
│   │   │   ├── pages/           # 按分类展示组件（BasicPage、FormPage、DataPage、NavPage、FeedbackPage、OthersPage）
│   │   │   │   └── components/  # 每个组件的独立演示页面（*ComponentPage.vue）
│   │   │   ├── components/      # 演示通用组件
│   │   │   │   ├── DemoSection.vue   # 组件演示区块（标题 + 描述 + 可折叠的 usage.md）
│   │   │   │   ├── DemoBlock.vue     # 单个示例卡片（标题 + slot + 代码）
│   │   │   │   ├── CodeBlock.vue     # 代码高亮展示
│   │   │   │   └── PageToc.vue       # 页面目录
│   │   │   ├── i18n/            # playground 站点级国际化（vue-i18n）
│   │   │   └── admin/           # Admin 后台子应用源码
│   │   │       ├── main.ts      # Admin 入口：Pinia + vue-router + vue-i18n + WindowsUI
│   │   │       ├── App.vue
│   │   │       ├── router/      # Admin 路由（含登录、权限守卫）
│   │   │       ├── views/       # Admin 页面（dashboard、login、user、article、order、profile、editor、nested、error）
│   │   │       ├── stores/      # Pinia 状态管理（auth、app、article、order、user）
│   │   │       ├── i18n/        # vue-i18n 国际化
│   │   │       ├── components/  # 业务组件（Breadcrumb、LangSelect、RichEditor、Screenfull、ThemeSetting）
│   │   │       ├── composables/ # 组合式函数（useCrud、usePermission）
│   │   │       ├── mock/        # 模拟数据（用户、角色、权限）
│   │   │       └── types/       # 类型定义
│   │   ├── index.html           # Playground 主页面入口
│   │   ├── admin.html           # Admin 后台页面入口
│   │   ├── vite.config.ts       # 开发别名指向库源码；自定义 docsServerPlugin 提供 /docs/*.md
│   │   └── package.json
│   │
│   ├── lowcode-admin/           # 🧩 低代码管理平台前端（@windows-ui/lowcode-admin）
│   │   ├── src/
│   │   │   ├── main.ts          # 入口：Pinia + vue-router + WindowsUI
│   │   │   ├── App.vue
│   │   │   ├── router/index.ts  # hash 路由 + 登录权限守卫
│   │   │   ├── api/             # axios 封装 + 各模块接口
│   │   │   ├── stores/          # Pinia（auth、app、menu、user）
│   │   │   ├── views/           # 页面（system、lowcode、flow、monitor、dashboard、login、pages）
│   │   │   ├── components/      # 业务组件（含 flow-designer 流程设计器）
│   │   │   ├── composables/     # useWebSocket 等
│   │   │   └── types/           # 类型定义
│   │   ├── index.html
│   │   ├── vite.config.ts       # 端口 5174，代理 /api 到 http://localhost:3001
│   │   └── package.json
│   │
│   ├── server/                  # 🔧 低代码管理平台后端（@windows-ui/server）
│   │   ├── src/
│   │   │   ├── index.ts         # 服务启动入口（http + WebSocket）
│   │   │   ├── app.ts           # Express 应用配置
│   │   │   ├── config/index.ts  # 环境变量与配置读取（PORT 默认 3001）
│   │   │   ├── db/index.ts      # Knex + SQLite 数据库实例
│   │   │   ├── routes/index.ts  # API 路由总线
│   │   │   ├── modules/         # 业务模块
│   │   │   │   ├── auth/        # 登录 / 刷新 / 登出 / 个人信息
│   │   │   │   ├── rbac/        # 用户 / 角色 / 菜单 / 部门
│   │   │   │   ├── system/      # 字典 / 字典分类 / 职务 / 公告 / 通知等
│   │   │   │   ├── lowcode/     # 数据模型 / 字段 / 表单 / 列表 / 编码规则 / 校验规则 / 动态 CRUD / 自定义接口 / 插件扩展
│   │   │   │   ├── monitor/     # 消息 / 模板 / 操作日志 / 服务器监控
│   │   │   │   ├── dashboard/   # 仪表盘 / 首页配置
│   │   │   │   ├── flow/        # 流程定义与实例
│   │   │   │   ├── common/      # 公共接口（如上传）
│   │   │   │   └── schedule/    # 定时任务与调度器
│   │   │   ├── middleware/      # auth、error、requestLog
│   │   │   └── utils/           # logger、response、websocket
│   │   ├── migrations/          # Knex 迁移文件
│   │   ├── seeds/               # Knex 种子数据
│   │   ├── data/lowcode.sqlite  # SQLite 数据文件（开发默认）
│   │   ├── .env.example         # 环境变量示例（PORT=3000，JWT 配置等）
│   │   ├── knexfile.js
│   │   └── package.json
│   │
│   └── admin/                   # 历史 Admin 构建产物（仅 dist / node_modules，无源码，不参与脚本）
│
├── docs/                        # 每个组件的使用说明文档
│   └── <component>/usage.md
├── designs/                     # 每个组件的设计文档
│   └── <component>/design.md
├── develops/                    # 每个组件的开发进度跟踪
│   └── <component>/progress.md
├── scripts/                     # Python 辅助脚本
│   ├── add_examples*.py
│   ├── examples.json            # 组件示例代码库
│   ├── gen_docs.py              # 根据 SFC 生成 usage.md 模板
│   ├── gen_docs_v2.py
│   └── sync_docs.py
│
└── sop/                         # 📋 低代码管理平台 SOP 文档集
    ├── architecture/            # 系统架构文档
    ├── backend/                 # 后端开发规范
    ├── database/                # 数据库设计文档
    ├── development/             # 开发工作流程与规范
    ├── lowcode/                 # 低代码平台核心设计
    ├── manuals/                 # 用户操作手册
    └── progress/                # 开发进度跟踪
```

---

## SOP 文档索引

`sop/` 目录收录低代码管理平台的标准作业程序（SOP），覆盖系统架构、开发规范、数据库设计、低代码核心机制、用户操作手册与项目进度。在涉及 `packages/lowcode-admin` 与 `packages/server` 的开发、重构或问题排查时，应优先查阅对应 SOP 文档。

### 目录说明

| 目录 | 说明 |
|------|------|
| `sop/architecture/` | 系统架构总览与前后端架构说明 |
| `sop/backend/` | 后端开发规范、分层约定与接口标准 |
| `sop/database/` | 数据库 schema 设计与表关系说明 |
| `sop/development/` | 低代码平台开发工作流程、组件评估与扩展规范、Git 提交规范 |
| `sop/lowcode/` | 低代码元数据模型、动态 API 约定、自定义接口、设计器配置规范、流程设计器说明、插件扩展规范 |
| `sop/manuals/` | 面向最终用户的操作手册（系统管理、低代码开发、监控消息等） |
| `sop/progress/` | 按阶段记录的开发进度与待办事项 |

### 关键文档速查

| 场景 | 推荐查阅文档 |
|------|--------------|
| 理解系统整体架构与数据流 | `sop/architecture/overview.md` |
| 新增/修改后端模块、接口或数据库 | `sop/development/workflow.md`、`sop/backend/*.md`、`sop/database/schema.md` |
| 扩展低代码数据模型、表单、列表、页面设计器 | `sop/lowcode/metadata.md`、`sop/lowcode/designer-spec.md` |
| 修改动态 CRUD 接口或运行时行为 / 新增自定义接口 | `sop/lowcode/dynamic-api.md`、`sop/manuals/lowcode/custom-api.md` |
| 扩展字段类型 / 图表类型 / 页面组件 / 开发新插件 | `sop/manuals/lowcode/plugin.md`、`sop/lowcode/designer-spec.md` |
| 调整流程设计器或审批相关功能 | `sop/lowcode/flow-designer.md` |
| 配置数据权限（行级）/ 字段权限 | `sop/manuals/system/data-permission.md`、`sop/manuals/system/field-permission.md` |
| 新增/修改面向用户的功能模块 | 同步更新 `sop/manuals/` 下对应手册 |
| 查看项目当前阶段与待办 | `sop/progress/phase-*.md` |

> **SOP 同步原则**：每完成一个低代码平台功能或阶段，应同步修订对应的 SOP 文档；若功能涉及最终用户操作，必须同步更新 `sop/manuals/` 下的用户手册。

---

## 构建与运行命令

> 根目录使用 `pnpm`（非 npm / yarn）。若尚未安装依赖，请先执行 `pnpm install`。

### 根目录脚本

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动 playground 开发服务器（同时承载组件文档站点与 Admin 后台） |
| `pnpm dev:admin` | 当前等价于 `pnpm dev`（Admin 与 playground 共享同一 Vite 服务，访问 `/admin.html`） |
| `pnpm dev:lowcode` | 启动低代码管理平台前端（默认端口 `5174`，代理 `/api` 到 `localhost:3001`） |
| `pnpm dev:server` | 启动后端服务（默认监听 `127.0.0.1:3001`，热重载；`.env.example` 中 PORT=3000，若复制为 `.env` 会覆盖该端口） |
| `pnpm build` | 构建 UI 库（ES + UMD + d.ts），输出到 `packages/windows-ui/dist/` |
| `pnpm build:playground` | 构建 playground 生产包（含 `index.html` 与 `admin.html` 双入口） |
| `pnpm build:admin` | 当前等价于 `pnpm build:playground` |
| `pnpm build:lowcode` | 构建低代码管理平台前端 |
| `pnpm build:server` | 编译后端 TypeScript 到 `packages/server/dist/` |
| `pnpm db:migrate` | 执行后端数据库迁移 |
| `pnpm db:migrate:rollback` | 回滚最近一次数据库迁移 |
| `pnpm db:seed` | 执行后端数据库种子（会清空并写入初始账号 `admin/admin`） |

### 库构建细节

- **入口**：`packages/windows-ui/src/index.ts`
- **产物**：
  - `dist/windows-ui.es.js`（ES Module）
  - `dist/windows-ui.umd.js`（UMD）
  - `dist/windows-ui.css`（合并后的样式，`cssCodeSplit: false`）
  - `dist/index.d.ts`（类型声明，由 `vite-plugin-dts` 生成）
- **外部依赖**：`vue`（不会打包进库）
- **构建前置检查**：`vue-tsc --noEmit` 类型检查通过后才会执行 Vite 构建
- **tsconfig 关键选项**：`strict: true`、`noUnusedLocals: true`、`noUnusedParameters: true`、`moduleResolution: bundler`

### Playground 开发细节

- `vite.config.ts` 中通过 alias 将 `@windows-ui/core` 指向 `../windows-ui/src/index.ts`，开发时修改库源码可直接热更新，无需先构建库。
- 内置 `docsServerPlugin`：开发服务器拦截 `/docs/<component>/usage.md` 请求，从 `../../docs` 目录读取并返回 Markdown 原文，供 `DemoSection.vue` 动态加载渲染。
- `DemoSection.vue` 使用 `marked` 将 Markdown 渲染为 HTML，`highlight.js` 用于代码块高亮。
- `Layout.vue` 顶部提供全局控件：可切换 `small / default / large` 尺寸，切换 `zh-CN / en-US` 语言，以及实时调整主色（primary）、成功色（success）、警告色（warning）、危险色（danger）。
- 构建时采用 `rollupOptions.input` 配置多入口：`index.html`（组件文档）与 `admin.html`（后台模板）。

### Admin 子应用开发细节

- 入口为 `packages/playground/admin.html`，加载 `src/admin/main.ts`。
- 使用 Pinia、vue-router（hash 模式）、vue-i18n。
- 内置模拟登录系统（`src/admin/stores/auth.ts`）：支持 `admin/admin`、`editor/editor`、`viewer/viewer` 三个账号，分别对应不同角色与权限。
- 路由守卫会在未登录时自动跳转 `/login`，`usePermission` 组合式函数用于按钮级权限控制。
- 业务组件包括：Breadcrumb、LangSelect、RichEditor、Screenfull、ThemeSetting。

### 低代码平台开发细节

- 前端入口 `packages/lowcode-admin/src/main.ts`；后端入口 `packages/server/src/index.ts`。
- 前端开发服务器默认端口 `5174`，并通过 `proxy` 将 `/api` 转发到后端 `http://localhost:3001`。
- 后端默认监听 `127.0.0.1:3001`，默认使用 SQLite（`packages/server/data/lowcode.sqlite`）。
- 后端数据库迁移位于 `packages/server/migrations/`，种子位于 `packages/server/seeds/`。
- 低代码核心能力：数据模型设计 → 字段管理 → 表单/列表配置 → 自动创建物理表 → 通过 `/:modelCode` 动态 CRUD 接口运行。
- 自定义接口：通过 Monaco 编辑器在线编写脚本，发布为 `/api/custom/*` 接口，支持多层路径与公开/登录访问控制。
- 插件扩展：通过「插件市场」安装插件，动态注册自定义字段类型、自定义图表类型、自定义页面组件。
- 低代码前端 additionally 包含基于 `@vue-flow` 的流程设计器与审批待办页面。

---

## 组件开发约定

### 文件与命名

1. **目录**：每个组件独占一个目录，`packages/windows-ui/src/components/<kebab-case-name>/`
2. **文件**：目录内通常只有一个 `<kebab-case-name>.vue`，例如 `button/button.vue`。部分复杂组件会在同目录下包含子组件（如 `form/form-item.vue`、`menu/sub-menu.vue`、`tree/tree-node.vue`）。
3. **组件名**：Vue 组件内部必须使用 `defineOptions({ name: 'W<Name>' })`，例如 `WButton`。
4. **注册前缀**：在 `index.ts` 中统一注册为 `w-<name>`，通过 `usePrefix()` 可支持自定义前缀。

### 单文件组件（SFC）规范

- 使用 `<script setup lang="ts">` + `defineProps` + `defineEmits`。
- Props 采用对象语法声明，便于设置默认值：

  ```ts
  defineProps({
    type: { type: String, default: 'default' },
    size: { type: String, default: undefined },
    disabled: Boolean
  })
  ```
- 样式使用 `<style scoped>`，类名遵循简化 BEM：
  - 基础块：`.w-button`
  - 修饰符：`.w-button--primary`、`.w-button--small`
  - 状态：`.is-plain`、`.is-disabled`、`.is-round`
  - 子元素：`.w-input__prefix`、`.w-input__suffix`

### CSS 变量与样式策略

- 所有主题色、字体、尺寸优先引用 `variables.css` 中的变量，禁止写死硬编码颜色（XP 视觉风格需要的经典渐变除外，需保持视觉一致性）。
- `base.css` 提供全局工具类（`.w-xp-theme`、`.w-xp-btn-base`、`.w-xp-input-base`、`.w-xp-window-base` 等），供复杂组件组合使用，这些类会全局生效。
- `WConfigProvider` 接收 `theme` 对象，支持动态修改主色等变量，并会自动推导 lighter / light / dark / darker 四个色阶以及标题栏渐变，直接注入到 `document.documentElement` 的内联样式中。
- 常用变量：
  - `--w-color-primary` / `--w-color-success` / `--w-color-warning` / `--w-color-danger` / `--w-color-info`
  - `--w-bg-color`（`#ece9d8`，经典 XP 米色背景）
  - `--w-font-family`（`'Tahoma', 'Microsoft Sans Serif', sans-serif`）
  - `--w-border-radius-base`（`3px`）
  - `--w-component-size` / `--w-component-size-large` / `--w-component-size-small`

### 公共工具

- **前缀**：`src/utils/prefix.ts` 提供 `usePrefix()` 与 `useGlobalSize()`，通过 Vue `provide/inject` 与 `WConfigProvider` 配合实现动态前缀和全局尺寸。
- **国际化**：`src/locale/index.ts` 提供 `useLocale()`、`setGlobalLocale()`、`registerLocale()`，语言包为单层键值对（键使用中文，值为对应语言译文），通过 `WConfigProvider` 或 `app.use(WindowsUI, options)` 注入配置。
- **类型**：`src/utils/types.ts` 定义 `ComponentSize = 'large' | 'default' | 'small'` 以及 `ConfigProviderContext`。

---

## 文档与进度跟踪

每新增或修改一个组件，**必须**同步更新以下三份文档（全部使用中文）：

| 目录 | 文件 | 内容要求 |
|------|------|----------|
| `docs/<component>/` | `usage.md` | 基础用法示例、Props / Events / Slots 表格、主题定制说明 |
| `designs/<component>/` | `design.md` | 组件分类、视觉设计（色彩、尺寸、圆角）、交互设计、可访问性 |
| `develops/<component>/` | `progress.md` | 状态（已完成/进行中）、实现清单、待优化项、变更记录 |

若修改涉及低代码平台功能（数据模型、表单/列表/页面设计器、流程、动态 API、监控、用户权限等）或面向最终用户的操作体验，还应同步更新 `sop/` 下对应的 SOP 文档与 `sop/manuals/` 用户手册。

> 当前项目尚未配置自动化文档生成工具，文档为纯 Markdown 手工维护。`scripts/` 下的 Python 脚本（如 `gen_docs.py`、`sync_docs.py`、`add_examples*.py`）用于辅助提取组件 Props / 生成示例模板，但产出的内容仍需人工校对。`scripts/examples.json` 中维护了一批可直接写入 usage.md 的组件示例代码。

---

## 测试策略

**现状**：已在 `packages/windows-ui` 中配置 **Vitest 1.6** + `@vue/test-utils` + `jsdom`，测试脚本为：

```bash
pnpm --filter @windows-ui/core test
```

- 配置位于 `packages/windows-ui/vitest.config.ts`：`environment: 'jsdom'`，`globals: true`。
- 当前共有 **37 个 `.spec.ts` 测试文件**、**203 个测试用例**，全部通过。

**测试范围**：
- 组件以单元测试为主：验证 Props 渲染、事件触发、CSS 类名切换。
- 复杂交互组件（如 `form`、`table`、`query-builder`、`dynamic-form`、`crud-table`）已补充集成测试。

**测试文件位置**：与组件 SFC 同目录，命名为 `<component>.spec.ts`。

**新增组件要求**：每新增一个通用组件，应同步编写对应的 `.spec.ts` 单元测试，覆盖：
- 基础渲染
- Props 变化
- 事件触发
- 关键交互路径

---

## 代码风格

- **缩进**：2 个空格
- **分号**：可选，但现有代码中 TS/JS 语句末尾通常省略分号
- **引号**：单引号
- **语言**：注释与文档以 **中文** 为主；代码中的字符串常量若为 UI 展示文本，也用中文
- **无 linter**：当前未安装 ESLint / Prettier，提交前请人工保持风格一致
- **TypeScript**：启用 `strict: true` 与 `noUnusedLocals: true`，禁止未使用变量/参数

---

## 新增组件流程

1. 在 `packages/windows-ui/src/components/` 下新建目录与 `.vue` 文件。
2. 实现组件，确保包含 `defineOptions({ name: 'W<Name>' })`。
3. 在 `packages/windows-ui/src/index.ts` 中：
   - `import W<Name> from './components/<name>/<name>.vue'`
   - 加入 `components` 数组
   - 加入 named export
4. 在 playground 的对应分类页面（如 `BasicPage.vue`、`FormPage.vue` 等）添加组件入口卡片。
5. 在 `packages/playground/src/router/index.ts` 添加该组件的路由。
6. 在 `packages/playground/src/pages/components/` 新建 `*ComponentPage.vue` 演示页面，使用 `demo-section` / `demo-block` 组织示例。
7. 在 `packages/playground/src/views/Layout.vue` 的侧边栏 `navItems` 中新增导航项。
8. 编写 `docs/<name>/usage.md`、`designs/<name>/design.md`、`develops/<name>/progress.md`。
9. 若该组件属于后台场景常用组件，视情况在 `packages/playground/src/admin/` 或 `packages/lowcode-admin/src/views/` 中补充示例页面。
10. 若修改涉及低代码平台能力或面向用户的功能，同步更新 `sop/` 下对应的 SOP 文档与用户手册（`sop/manuals/`）。
11. 运行 `pnpm --filter @windows-ui/core test` 确保新增测试通过，运行 `pnpm dev` 验证 playground 效果，运行 `pnpm build` 验证库构建无报错。

---

## 安全与注意事项

- **SVG 图标**：`WIcon` 组件内部使用 `v-html` 渲染内联 SVG，目前图标为项目内置常量；`svg` prop 支持外部传入 SVG 字符串，若使用外部输入需防范 XSS（对用户输入做净化）。
- **样式隔离**：各组件使用 `scoped`，但全局主题变量和 `base.css` 中的工具类（如 `.w-xp-theme`、`.w-xp-btn-base`）会全局生效。
- **peerDependency**：库仅将 `vue` 标记为 `peerDependency`，发布时务必确保版本兼容 `^3.4.0`。
- **动态主题副作用**：`WConfigProvider` 会在挂载时将主题变量写入 `document.documentElement.style`，并在卸载时自动清理。多个 `WConfigProvider` 嵌套时，后挂载的实例会覆盖前者写入的变量。
- **Admin 模拟认证**：`src/admin/stores/auth.ts` 使用 `localStorage` 存储 mock token，权限判断基于前端硬编码角色，**不可用于生产环境**。
- **低代码后端认证**：后端使用 JWT（secret 来自 `.env`），token 黑名单为内存 `Set`；开发默认账号为 `admin/admin`（由 seed 写入），**生产环境必须修改 JWT_SECRET 与默认密码**。
- **动态 SQL 风险**：低代码模块通过 Knex 拼接动态表名/字段名进行 CRUD，字段过滤与关键字搜索已使用参数化查询，但 `filters` 中的 `field` 字段未做白名校验，若直接暴露给不可信用户需谨慎加固。
- **SQL 字段变更限制**：后端低代码字段删除目前仅删除元数据，未从 SQLite 物理表中删除列（SQLite 不支持 `DROP COLUMN`），生产环境如需完整字段同步需自行实现表重建逻辑。
- **文件上传**：后端使用 `multer` 处理上传文件，上传目录 `/uploads` 以静态资源方式暴露；生产环境应对文件类型、大小与访问权限做额外限制。

---

## 部署与 CI/CD

- 本项目**未配置** CI/CD 流水线（无 `.github/workflows`、无 Docker、无部署脚本）。
- 库构建产物输出到 `packages/windows-ui/dist/`，可直接作为 npm 包发布。
- Playground 为静态 Vite 站点，构建后生成双入口（`index.html` + `admin.html`），可部署到任意静态托管服务。
- 低代码前端构建产物输出到 `packages/lowcode-admin/dist/`，可单独部署。
- 后端编译产物输出到 `packages/server/dist/`，生产环境可执行 `pnpm --filter @windows-ui/server start`（即 `node dist/index.js`）启动；首次部署需执行 `pnpm db:migrate` 与 `pnpm db:seed`。

---

## 快速参考

| 问题 | 答案 |
|------|------|
| 用什么包管理器？ | pnpm |
| 怎么启动开发？ | `pnpm dev`（组件文档站 + Admin），`pnpm dev:lowcode`（低代码前端），`pnpm dev:server`（后端） |
| 怎么构建组件库？ | `pnpm build` |
| 组件文件放哪？ | `packages/windows-ui/src/components/<name>/<name>.vue` |
| 怎么导出组件？ | 在 `packages/windows-ui/src/index.ts` import + 加入数组 + named export |
| 怎么写文档？ | 在 `docs/`、`designs/`、`develops/` 下各建 `<name>/<file>.md` |
| 主题怎么改？ | 覆盖 `:root` 中的 `--w-*` CSS 变量，或通过 `WConfigProvider` 传 `theme` 对象 |
| 多语言怎么配？ | `app.use(WindowsUI, { locale: 'en-US' })` 或 `<w-config-provider locale="en-US">`，也支持传入自定义单层语言对象 |
| 怎么跑测试？ | `pnpm --filter @windows-ui/core test`（当前 37 个 spec 文件、203 个用例全部通过） |
| Admin 后台在哪？ | playground 内的多入口子应用：`packages/playground/src/admin/`（访问 `/admin.html`） |
| 低代码平台在哪？ | `packages/lowcode-admin/` + `packages/server/` |
