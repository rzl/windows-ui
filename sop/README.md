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
├── database/         # 数据库设计文档
├── lowcode/          # 低代码平台设计
├── progress/         # 开发进度跟踪
└── manuals/          # 用户操作手册（交付给用户）
```

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
