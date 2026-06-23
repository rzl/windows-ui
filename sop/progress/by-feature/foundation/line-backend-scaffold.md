# 子线：后端脚手架

## 来源阶段

[phase-1：基础框架与 SOP 文档体系](../../by-phase/phase-1.md)

## 目标

搭建 Node.js + Express + Knex + SQLite 后端脚手架，支持迁移、种子、统一响应和日志。

## 关键实现

- 初始化 `packages/server`
- 配置 Knex + SQLite 连接、迁移、种子
- 搭建 Express 分层结构
- 统一响应格式、错误处理、请求日志

## 验收标准

- [x] `pnpm dev:server` 启动无报错
- [x] 迁移与种子可正常执行
- [x] API 错误返回统一格式
