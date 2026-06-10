# Windows UI 管理后台模板开发计划

## 目标
基于 Windows UI 组件库创建一个完整的管理后台模板，使用 Pinia 全局状态管理，支持登录/权限/路由管理，包含列表/表单/增删改查（全部通过 Pinia 动态实现）。组件不满足时扩展相应组件，并同步文档。

## 用户选择
- **部署方式**：单独 `packages/admin` 包
- **业务领域**：用户管理 + 文章/订单管理 + 通用 CRUD 生成器
- **权限粒度**：路由级 + 按钮级

---

## 架构概览

```
packages/admin/
├── package.json              # 依赖 Pinia, vue-router, @windows-ui/core
├── vite.config.ts            # Vite 配置，alias 指向库源码
├── tsconfig.json
├── index.html
├── src/
│   ├── main.ts               # createApp + use(pinia) + use(router) + use(WindowsUI)
│   ├── App.vue
│   ├── router/
│   │   └── index.ts          # 路由定义 + 路由守卫（权限拦截）
│   ├── stores/
│   │   ├── index.ts          # Pinia 实例导出
│   │   ├── auth.ts           # 登录状态、Token、用户信息
│   │   ├── user.ts           # 用户管理 CRUD
│   │   ├── article.ts        # 文章管理 CRUD
│   │   ├── order.ts          # 订单管理 CRUD
│   │   └── app.ts            # 全局配置（侧边栏折叠、主题、语言、Tabs）
│   ├── views/
│   │   ├── login/
│   │   │   └── Login.vue     # 登录页（XP 风格）
│   │   ├── layout/
│   │   │   └── AdminLayout.vue # 后台布局（侧边栏 + 顶部栏 + Tabs + 内容区）
│   │   ├── dashboard/
│   │   │   └── Dashboard.vue # 首页仪表盘
│   │   ├── user/
│   │   │   └── UserList.vue  # 用户列表（Table + SearchForm + Pagination）
│   │   ├── article/
│   │   │   └── ArticleList.vue
│   │   ├── order/
│   │   │   └── OrderList.vue
│   │   ├── profile/
│   │   │   └── Profile.vue   # 个人中心（信息/密码/系统配置）
│   │   ├── editor/
│   │   │   └── EditorPage.vue # 富文本编辑器示例
│   │   ├── nested/           # 多级菜单示例
│   │   │   ├── Menu1.vue
│   │   │   ├── Menu2-1.vue
│   │   │   └── Menu2-2.vue
│   │   └── error/
│   │       ├── Error401.vue
│   │       └── Error404.vue
│   ├── components/
│   │   ├── Breadcrumb.vue    # 动态面包屑
│   │   ├── LangSelect.vue    # 语言切换
│   │   ├── ThemeSetting.vue  # 主题设置按钮
│   │   ├── Screenfull.vue    # 全屏按钮
│   │   └── RichEditor.vue    # 富文本编辑器（TinyMCE CDN）
│   ├── composables/
│   │   ├── useCrud.ts        # 通用 CRUD 逻辑封装
│   │   └── usePermission.ts  # 权限检查组合式函数
│   ├── i18n/                 # 国际化
│   │   ├── index.ts
│   │   ├── zh-CN.ts
│   │   └── en-US.ts
│   ├── types/                # 类型定义
│   └── mock/                 # Mock 数据
│       └── data.ts
└── docs/
    └── admin/usage.md        # 管理后台使用文档
```

---

## 阶段划分

### 阶段一：基础设施搭建 ✅
1. [x] 创建 `packages/admin` 目录结构
2. [x] 添加 `pinia` 依赖（根目录和 admin 包）
3. [x] 配置 `vite.config.ts`（alias 指向 `@windows-ui/core`）
4. [x] 配置路由（独立路由文件，hash 模式）
5. [x] 配置 Pinia Store 入口
6. [x] 编写 `main.ts` 和 `App.vue`

### 阶段二：扩展组件（库层面）✅
分析现有组件缺口，在 `packages/windows-ui` 中扩展：

| 组件 | 缺口 | 扩展方案 | 状态 |
|------|------|----------|------|
| **Form** | 无验证规则执行，仅显示外部传入的错误 | 增强 `WForm`/`WFormItem`：支持 `rules` 对象验证（必填、正则、自定义函数），`validate`/`resetFields` 方法 | ✅ 完成 |
| **Icon** | 缺少后台管理专用图标 | 新增 `computer`、`logout`、`password`、`cart`、`pie-chart`、`bar-chart` 及 `setting` 别名 | ✅ 完成 |

> 扩展组件已同步更新 `packages/windows-ui/src/index.ts`、docs、designs、develops。

### 阶段三：Pinia Store 与 Mock 数据 ✅
1. [x] **auth store**：login/logout/getInfo，Token 存 localStorage
2. [x] **user store**：用户列表分页、增删改查、批量删除
3. [x] **article store**：文章列表分页、增删改查、状态切换
4. [x] **order store**：订单列表分页、增删改查
5. [x] **app store**：侧边栏折叠、主题配置、语言、Tabs 管理
6. [x] **Mock 数据**：使用纯 JS 对象模拟后端，带 setTimeout 模拟延迟

### 阶段四：页面开发 ✅
1. [x] **Login.vue**：XP 风格登录页（用户名、密码）
2. [x] **AdminLayout.vue**：侧边栏菜单（根据权限动态生成）、顶部栏（面包屑/全屏/用户下拉）、Tabs 标签页
3. [x] **Dashboard.vue**：统计卡片
4. [x] **UserList.vue**：用户 CRUD 完整演示
5. [x] **ArticleList.vue**：文章 CRUD 完整演示
6. [x] **OrderList.vue**：订单 CRUD 完整演示
7. [x] **Profile.vue**：个人中心（基本信息 + 修改密码 + 系统配置抽屉）
8. [x] **EditorPage.vue**：富文本编辑器示例
9. [x] **Nested**：多级菜单示例（menu1 / menu2-1 / menu2-2）
10. [x] **Error401.vue / Error404.vue**：错误页面

### 阶段五：权限系统 ✅
1. [x] **路由守卫**：登录拦截、权限校验、404 处理
2. [x] **动态菜单**：根据权限过滤侧边栏菜单
3. [x] **按钮级权限**：`auth.hasPermission()` 方法
4. [x] **角色模拟**：admin / editor / viewer 三种角色，权限不同

### 阶段六：通用 CRUD ✅
1. [x] `useCrud` 组合式函数统一处理：加载、搜索、分页、新增、编辑、删除、批量删除

### 阶段七：增强功能 ✅
1. [x] **国际化**：vue-i18n 支持 zh-CN / en-US
2. [x] **主题切换**：WConfigProvider + CSS 变量，支持 primary/success/warning/danger 及组件大小
3. [x] **动态面包屑**：Breadcrumb 组件根据 route.matched 自动生成
4. [x] **Screenfull 全屏**：screenfull 库封装
5. [x] **富文本编辑器**：TinyMCE CDN 引入
6. [x] **Tabs 标签页**：visitedViews 管理，支持关闭/右键菜单

### 阶段八：文档同步 ✅
每扩展一个组件，同步更新：
- `docs/<component>/usage.md`
- `designs/<component>/design.md`
- `develops/<component>/progress.md`
- `packages/admin/docs/admin/usage.md`（管理后台整体文档）

---

## 技术要点

### Pinia 设计模式
```ts
// 每个 store 统一接口
interface CrudState<T> {
  list: T[]
  total: number
  loading: boolean
  query: { page: number; pageSize: number; keyword: string }
  current: T | null
}

// useCrud 封装通用逻辑
const useCrud = (store: any, options: { immediate?: boolean } = {}) => {
  // 返回 { dialogVisible, dialogTitle, formModel, selectedIds, openDialog, closeDialog, handleSearch, handleReset, handlePageChange, handleSave, handleDelete, handleBatchDelete, handleSelectionChange }
}
```

### 权限设计
```ts
// auth store
const permissions = ['user:list', 'user:create', 'user:edit', 'user:delete', ...]
const roles = ['admin', 'editor', 'viewer']

// 按钮级权限
auth.hasPermission('user:delete')
```

### 组件扩展原则
- 遵循现有 SFC 规范（`<script setup lang="ts">`）
- 使用 `defineOptions({ name: 'W<Name>' })`
- 样式使用 `scoped`，引用 `variables.css` 变量
- 在 `index.ts` 中注册和导出
- 保持向后兼容，不破坏现有组件 API

---

## 风险与应对

| 风险 | 应对 |
|------|------|
| Form 验证增强可能影响现有 playground 演示 | 保持 props 兼容，仅新增 `rules` 支持；`validate` 方法新增，不改变原有行为 |
| 任务量过大 | 分阶段交付，每阶段可独立运行验证 |
| Pinia 与现有 playground 依赖冲突 | admin 包独立依赖，不影响 playground |

---

## 交付物清单

1. `packages/admin/` 完整可运行的管理后台包
2. 扩展的组件（Form 增强、Icon 扩充）
3. 5 个 Pinia Store（auth、user、article、order、app）
4. 10+ 个页面（登录、布局、仪表盘、用户、文章、订单、个人中心、编辑器、多级菜单、错误页）
5. 2 个组合式函数（useCrud、usePermission）
6. 5 个公共组件（Breadcrumb、LangSelect、ThemeSetting、Screenfull、RichEditor）
7. 国际化支持（zh-CN / en-US）
8. 更新后的 `packages/windows-ui/src/index.ts`
9. 同步文档（docs、designs、develops 各组件文档 + admin 整体文档）
10. 根目录 `pnpm dev:admin` 脚本（启动 admin 开发服务器）
