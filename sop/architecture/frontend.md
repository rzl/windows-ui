# 前端架构

## 包结构

### packages/windows-ui
- UI 组件库，所有组件以 `w-` 为默认前缀
- 组件按分类组织：Basic、Form、Data、Navigation、Feedback、Others
- 通用管理组件：WSearchForm、WTable、WForm、WDialog、WDrawer、WPermission 等

### packages/lowcode-admin
- 低代码平台前端，真实对接后端 API
- 技术栈：Vue 3 + TypeScript + Pinia + Vue Router + Axios + windows-ui

```
packages/lowcode-admin/src/
├── api/              # 按模块封装的 API（auth.ts、user.ts、menu.ts...）
├── router/           # 路由配置
├── stores/           # Pinia 状态（auth、user、menu、app...）
├── views/            # 页面
│   ├── layout/       # 布局框架
│   ├── system/       # 系统管理页面
│   └── login/        # 登录页
├── main.ts
└── App.vue
```

### packages/playground/src/admin
- 原有 Admin 模板示例，使用 mock 数据
- 保留作为组件使用示例与模板参考

## 路由与菜单

- 路由采用 Vue Router hash 模式
- 菜单从后端 `/menus/tree` 接口动态获取
- 菜单项包含 `name`、`path`、`component`、`meta.title`、`meta.permission`
- 权限不足时显示 401 页面

## 状态管理

- `auth`：token、userInfo、登录/登出、权限判断
- `user`：用户列表、查询条件、分页
- `menu`：动态菜单树
- `app`：侧边栏折叠、主题、尺寸、多标签页

## API 请求

- axios 实例统一配置 baseURL、超时、请求/响应拦截
- 请求拦截：自动附加 `Authorization: Bearer <token>`
- 响应拦截：统一错误提示，401 跳转登录

## 通用页面模式

- 列表页：WSearchForm + 工具栏 + WTable + WPagination + WDialog 表单
- 表单页：WDynamicForm 根据 JSON 配置渲染
- 详情页：WDescriptions
