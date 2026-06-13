# 阶段一：基础框架与 SOP 文档体系

## 目标

搭建可运行、可扩展、可交接的基础骨架：
1. SOP 文档目录与核心文档
2. Express + Knex + SQLite 后端脚手架
3. 认证与 RBAC 核心 API
4. 独立的 `packages/lowcode-admin` 前端包
5. 通用组件扩展（WCrudTable、WDynamicForm、WQueryBuilder）
6. 用户管理完整前后端示例

## 任务清单

- [x] 创建 `sop/` 目录结构与 README、架构、数据库文档
- [x] 初始化 `packages/server` 包与依赖
- [x] 配置 Knex + SQLite 连接、迁移、种子
- [x] 搭建 Express 分层结构、统一响应、错误处理、日志
- [x] 实现 JWT 认证中间件与 `/auth/*` API
- [x] 实现用户、角色、菜单、部门、字典迁移与 CRUD API
- [x] 初始化 `packages/lowcode-admin` 包与 Vite 配置
- [x] 实现 axios 封装、Pinia stores、路由与布局
- [x] 实现 `lowcode-admin` 用户管理页面
- [x] 扩展 `WCrudTable`、`WDynamicForm`、`WQueryBuilder` 并同步文档
- [x] 更新根 `package.json` 脚本
- [x] 联调验证：可登录、可增删改查用户

## 验收标准

- `pnpm dev:server` 启动后端服务无报错
- `pnpm dev:lowcode` 启动前端无报错
- 使用 `admin/admin` 登录成功并获取菜单
- 用户管理页面可查询、新增、编辑、删除用户
- 原有 `pnpm dev`（playground + 原 Admin 模板）仍可正常运行

## 运行记录

- 2026-06-13：完成后端 SQLite 编译（Termux 需 `GYP_DEFINES="android_ndk_path=/data/data/com.termux/files/usr"`）
- 2026-06-13：后端默认端口调整为 3001（避免本地 Gitea 占用 3000）
- 2026-06-13：UI 库、lowcode-admin、后端均构建/运行通过
