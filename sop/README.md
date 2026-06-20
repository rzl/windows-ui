# 低代码管理平台 SOP 文档

> SOP（Standard Operating Procedure）标准作业程序：记录系统架构、开发规范、数据库设计、接口约定与开发进度，便于团队协作、系统重构与进度跟踪。

## 项目定位

基于 `windows-ui` Vue 3 组件库（Windows XP 风格）构建的低代码管理平台，目标是通过配置化方式快速生成业务功能，同时提供完整的系统管理、消息中心、系统监控等企业级能力。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 UI 库 | Vue 3 + TypeScript + Vite（`packages/windows-ui`） |
| 低代码平台前端 | Vue 3 + Pinia + Vue Router + Axios（`packages/lowcode-admin`） |
| Admin 模板示例 | Vue 3 + Pinia + Vue Router + vue-i18n（`packages/playground/src/admin`，保留 mock） |
| 后端 | Node.js + Express + JWT + Knex + SQLite（默认） |
| 包管理 | pnpm workspaces |

## 目录说明

```
sop/
├── architecture/     # 系统架构文档
├── backend/          # 后端开发规范
├── frontend/         # 前端开发规范
├── development/      # 开发工作流程与规范
├── database/         # 数据库设计文档
├── lowcode/          # 低代码平台设计
├── progress/         # 开发进度跟踪
└── manuals/          # 用户操作手册（交付给用户）
```

## 文档索引

| 文档 | 说明 |
|---|---|
| [development/workflow.md](./development/workflow.md) | 低代码平台开发工作流程、组件扩展规范、Git 提交规范 |
| [lowcode/README.md](./lowcode/README.md) | 低代码平台核心设计文档索引 |
| [lowcode/metadata.md](./lowcode/metadata.md) | 元数据模型设计 |
| [lowcode/dynamic-api.md](./lowcode/dynamic-api.md) | 动态 CRUD API 约定 |
| [lowcode/designer-spec.md](./lowcode/designer-spec.md) | 表单/列表设计器配置规范 |
| [architecture/overview.md](./architecture/overview.md) | 系统架构总览 |
| [database/schema.md](./database/schema.md) | 数据库设计 |
| [progress/phase-15.md](./progress/phase-15.md) | 阶段十五：顶部系统设置与国际化 |
| [progress/phase-16.md](./progress/phase-16.md) | 阶段十六：数据权限与行级隔离（规划中） |
| [manuals/README.md](./manuals/README.md) | 用户操作手册总览 |
| [manuals/getting-started/homepage.md](./manuals/getting-started/homepage.md) | 首页、导航与系统设置 |
| [manuals/lowcode/model.md](./manuals/lowcode/model.md) | 数据模型与低代码开发手册 |
| [manuals/lowcode/report.md](./manuals/lowcode/report.md) | 报表设计器手册 |
| [manuals/lowcode/print-template.md](./manuals/lowcode/print-template.md) | 打印模板设计器手册 |
| [manuals/lowcode/external-datasource.md](./manuals/lowcode/external-datasource.md) | 外部数据源手册 |
| [manuals/flow/list.md](./manuals/flow/list.md) | 流程定义手册 |
| [manuals/flow/pending.md](./manuals/flow/pending.md) | 我的待办手册 |
| [manuals/schedule/task.md](./manuals/schedule/task.md) | 定时任务手册 |
| [manuals/monitor/dashboard-designer.md](./manuals/monitor/dashboard-designer.md) | 仪表盘设计器使用手册 |

## 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev:server       # 启动后端服务（默认 http://127.0.0.1:3001）
pnpm dev:lowcode      # 启动低代码平台前端（默认 http://localhost:5174）
pnpm dev              # 启动原 playground + Admin 模板

# 数据库
pnpm db:migrate       # 执行数据库迁移
pnpm db:seed          # 初始化基础数据

# 构建
pnpm build            # 构建 UI 库
pnpm build:lowcode    # 构建低代码平台前端
pnpm build:server     # 构建后端
```

> 注意：后端默认监听 `127.0.0.1:3001`，若需修改可在 `packages/server/.env` 中设置 `PORT`。

## 开发原则

1. **保留原 Admin 模板**：`packages/playground/src/admin/` 仅作为示例模板，不接入真实后端。
2. **组件扩展优先**：现有组件不满足需求时，优先扩展现有组件，同步更新 `docs/designs/develops` 三份文档。
3. **SOP 即代码**：每个阶段开始前写 SOP，阶段结束后根据实现修订 SOP。
4. **用户操作手册同步**：每新增或修改一个功能模块，必须同步更新 `sop/manuals/` 下对应的用户操作手册。
5. **数据库无关语法**：Knex 迁移文件保持通用 SQL 语法，便于从 SQLite 切换到 MySQL/PostgreSQL。
6. **中文注释与文档**：注释、文档、UI 文本以中文为主。
