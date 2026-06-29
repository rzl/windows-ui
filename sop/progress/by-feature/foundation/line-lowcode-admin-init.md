# 子线：lowcode-admin 前端包初始化

## 来源阶段

[phase-1：基础框架与 SOP 文档体系](../../by-phase/phase-1.md)

## 目标

创建独立的 `packages/lowcode-admin` 前端包，接入 Windows UI 组件库、Pinia 与路由。

## 关键实现

- 初始化 `packages/lowcode-admin` 包与 Vite 配置
- 实现 axios 封装、Pinia stores、路由与布局
- 完成用户管理页面示例
- 认证与会话管理：双令牌刷新、启动校验、401 自动跳转登录、登录后回源

## 验收标准

- [x] `pnpm dev:lowcode` 启动无报错
- [x] 使用 `admin/admin` 登录成功并获取菜单
- [x] 用户管理页面可查询、新增、编辑、删除用户
- [x] 未登录或令牌过期时自动跳转登录页
- [x] 重新登录后返回被中断的页面
