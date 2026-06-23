# 阶段二：系统管理模块

## 目标

在 `packages/lowcode-admin` 中补齐系统管理全部功能，与后端真实 API 打通。

## 功能清单

- 用户管理（已在阶段一完成）
- 角色管理：列表、新增、编辑、删除、分配权限
- 菜单管理：树形列表、新增、编辑、删除
- 部门管理：树形列表、新增、编辑、删除
- 字典管理：字典列表 + 字典项维护
- 分类字典、系统公告、职务管理、通讯录（预留）

## 任务清单

- [x] 补齐后端字典管理 CRUD API
- [x] 实现 lowcode-admin 角色管理页面
- [x] 实现 lowcode-admin 菜单管理页面（树形）
- [x] 实现 lowcode-admin 部门管理页面（树形）
- [x] 实现 lowcode-admin 字典管理页面
- [x] 更新 lowcode-admin 路由与侧边栏菜单
- [x] 构建与联调验证

## 验收标准

- 角色管理：可增删改查、分配菜单/按钮权限
- 菜单管理：可维护树形菜单
- 部门管理：可维护树形部门
- 字典管理：可维护字典及字典项
- 所有页面通过真实后端 API 操作 SQLite 数据库
- `pnpm build:lowcode` 与 `pnpm build:server` 均通过

## 运行记录

- 2026-06-13：完成后端字典 CRUD API（dicts / dict-items）
- 2026-06-13：完成 RoleList、MenuList、DeptList、DictList 页面
- 2026-06-13：更新种子数据，系统管理菜单包含用户/角色/菜单/部门/字典
- 2026-06-13：`pnpm build:lowcode`、`pnpm build:server` 通过，API 联调通过
