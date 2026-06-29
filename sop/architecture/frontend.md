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
├── locale/           # 平台级多语言（单层键值对，中文作键）
│   ├── lang/         # zh-CN.ts / en-US.ts
│   └── index.ts      # useLowcodeLocale / createLowcodeI18n
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
- `app`：侧边栏折叠、主题、尺寸、语言、多标签页；设置项持久化到 `localStorage`

## 主题与多语言

### 主题配置

- `App.vue` 通过 `w-config-provider` 向组件库注入 `size` 与 `theme`。
- `appStore.theme` 包含 `primary`、`success`、`warning`、`danger`，修改后由 `WConfigProvider` 自动计算色阶并写入 CSS 变量，即时生效。
- 设置保存在 `localStorage`（`lowcode-admin-settings`），刷新后自动恢复。

### VConsole 调试

- 通过 `appStore.vconsoleEnabled` 控制是否启用 VConsole。
- 启用时由 `App.vue` 调用 `utils/vconsole.ts` 中的 `loadVConsole()`，动态从 CDN（`https://unpkg.com/vconsole@latest/dist/vconsole.min.js`）加载脚本并实例化。
- 关闭时调用 `destroyVConsole()` 销毁实例。
- VConsole 开关同样持久化到 `localStorage`。

### 多语言

- 低代码平台维护独立的多语言模块 `src/locale/`，结构与组件库 `packages/windows-ui/src/locale` 一致：单层键值对，中文作为键。
- `main.ts` 中通过 `createLowcodeI18n({ locale: appStore.locale })` 注册。
- 页面中使用 `useLowcodeLocale().t('中文键')` 获取当前语言译文。
- 切换语言时同步更新 `appStore.locale` 与组件库 `WConfigProvider` 的 `locale`，保证平台自有文本与组件库内置文本同时切换。

## API 请求

- axios 实例统一配置 baseURL、超时、请求/响应拦截
- 请求拦截：自动从 `localStorage` 读取并附加 `Authorization: Bearer <token>`
- 响应拦截：统一错误提示；对后端返回的 `code === 401` 或 HTTP 401 统一处理

### 认证与会话

- **双令牌**：登录后返回 `accessToken`（默认 2 小时有效）与 `refreshToken`（默认 7 天有效），分别保存在 `lowcode_token` 与 `lowcode_refresh_token`。
- **启动校验**：`main.ts` 启动时若存在 `lowcode_token` 但未恢复用户信息，会调用 `/auth/profile` 校验令牌；若令牌已过期，自动清理并跳转登录页。
- **路由守卫**：未登录访问非公开路由时，跳转登录页并携带 `?redirect=<来源页路径>`。
- **自动刷新**：接口返回 401 且 `refreshToken` 有效时，自动换取新 `accessToken` 并重试原请求；无需用户重新登录。
- **自动跳转**：`refreshToken` 也过期、未登录或令牌被后端禁用时，自动跳转登录页并携带来源页参数。
- **登录回源**：登录成功后读取 `redirect` 查询参数，返回之前的页面；仅允许站内相对路径，无来源页时默认进入 `/`。

## 通用页面模式

- 列表页：WSearchForm + 工具栏 + WTable + WPagination + WDialog 表单
- 表单页：WDynamicForm 根据 JSON 配置渲染
- 详情页：WDescriptions
