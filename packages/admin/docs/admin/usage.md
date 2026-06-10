# Windows UI Admin - 管理后台模板使用说明

## 项目简介

Windows UI Admin 是基于 Windows UI 组件库开发的管理后台模板，采用 Vue 3 + Pinia + Vue Router + vue-i18n + screenfull 技术栈，支持登录认证、权限管理、路由守卫、CRUD 数据管理、国际化多语言、主题切换、全屏、动态面包屑、Tabs 标签页等功能。

## 特性

- 🖥️ Windows XP 经典视觉风格
- 🔐 登录/权限/路由管理
- 📊 仪表盘统计展示
- 👤 用户管理（增删改查）
- 📝 文章管理（增删改查）
- 🛒 订单管理（增删改查）
- 🌐 国际化多语言（中文/英文）
- 🎨 主题色切换 + 组件大小设置
- 📍 动态面包屑
- 🖥️ Screenfull 全屏
- 📝 富文本编辑器（TinyMCE CDN）
- 📂 动态侧边栏（支持多级路由嵌套，最多三级）
- 🏷️ Tabs 标签页导航（右键菜单：刷新/关闭/关闭其他/关闭全部）
- 🎭 多角色权限控制（admin / editor / viewer）
- ⚠️ 个性错误页面（401、404）
- 👤 个人中心（基本信息 + 修改密码 + 系统配置）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动管理后台开发服务器
pnpm dev:admin
```

## 测试账号

| 账号 | 密码 | 权限 |
|------|------|------|
| admin | admin | 全部权限 |
| editor | editor | 内容管理权限 |
| viewer | viewer | 只读权限 |

## 项目结构

```
packages/admin/src/
├── main.ts              # 入口文件（注册 i18n、Pinia、Router、WindowsUI）
├── App.vue              # 根组件
├── router/              # 路由配置（含嵌套路由 + 错误页面 + 路由守卫）
│   └── index.ts
├── stores/              # Pinia 状态管理
│   ├── index.ts         # Pinia 实例导出
│   ├── auth.ts          # 登录认证、Token、用户信息、权限检查
│   ├── user.ts          # 用户管理 CRUD
│   ├── article.ts       # 文章管理 CRUD
│   ├── order.ts         # 订单管理 CRUD
│   └── app.ts           # 全局配置（主题、语言、大小、侧边栏、Tabs）
├── views/               # 页面视图
│   ├── login/           # 登录页
│   ├── layout/          # 后台布局（AdminLayout：多级菜单 + Tabs + 用户下拉）
│   ├── dashboard/       # 仪表盘
│   ├── user/            # 用户管理
│   ├── article/         # 文章管理
│   ├── order/           # 订单管理
│   ├── profile/         # 个人中心（信息/密码/系统配置）
│   ├── editor/          # 富文本编辑器示例
│   ├── nested/          # 多级菜单示例（menu1 / menu2-1 / menu2-2）
│   └── error/           # 错误页面（401、404）
├── components/          # 公共组件
│   ├── Breadcrumb.vue   # 动态面包屑
│   ├── LangSelect.vue   # 语言切换
│   ├── ThemeSetting.vue # 主题设置按钮
│   ├── Screenfull.vue   # 全屏按钮
│   └── RichEditor.vue   # 富文本编辑器（TinyMCE CDN）
├── composables/         # 组合式函数
│   ├── useCrud.ts       # 通用 CRUD 逻辑
│   └── usePermission.ts # 权限检查组合式函数
├── i18n/                # 国际化
│   ├── index.ts         # i18n 实例
│   ├── zh-CN.ts         # 中文
│   └── en-US.ts         # 英文
├── types/               # 类型定义
└── mock/                # Mock 数据
    └── data.ts          # 菜单、用户、文章、订单模拟数据
```

## 国际化

通过 `vue-i18n` 实现多语言切换，支持中文（zh-CN）和英文（en-US）。

```vue
<template>
  <span>{{ $t('menu.dashboard') }}</span>
</template>
```

- 语言文件位于 `src/i18n/` 目录
- 切换语言时自动持久化到 localStorage
- 在个人中心「系统配置」中提供语言切换按钮

## 主题定制

通过 `WConfigProvider` 和 CSS 变量实现主题切换：

```vue
<w-config-provider :size="app.size" :theme="app.theme">
  <router-view />
</w-config-provider>
```

支持的配置项：
- **theme**：主题色对象 `{ primary, success, warning, danger }`
- **size**：组件大小 `'large' | 'default' | 'small'`
- 在顶部栏「设置」按钮或个人中心「系统配置」中均可打开抽屉面板进行设置（颜色选择器 + 大小切换 + 重置默认）

## 动态侧边栏

`AdminLayout` 使用 `w-menu` 组件渲染侧边栏菜单，支持 `mode="vertical"` 和 `:collapse` 收起状态：
- 一级菜单：直接路由跳转
- 二级菜单：点击展开/收起子菜单（收起时悬浮显示）
- 三级菜单：嵌套在二级菜单下

菜单数据通过 `transformMenu` 函数将 `mockMenus` 转换为 `w-menu` 所需的 `items` 格式（`path` 映射为 `value`），`@select` 事件中通过 `router.push(value)` 完成导航。

菜单根据用户权限动态过滤，无权限的菜单自动隐藏。

示例路由配置：
```ts
{
  path: '/nested',
  redirect: '/nested/menu1',
  meta: { title: '多级菜单示例', permissions: ['dashboard'] },
  children: [
    { path: 'menu1', component: Menu1, meta: { title: '菜单 1' } },
    {
      path: 'menu2',
      meta: { title: '菜单 2' },
      children: [
        { path: 'menu2-1', component: Menu2_1, meta: { title: '菜单 2-1' } },
        { path: 'menu2-2', component: Menu2_2, meta: { title: '菜单 2-2' } }
      ]
    }
  ]
}
```

## Tabs 标签页

`AdminLayout` 自动收集已访问的路由，在顶部栏下方显示 Tabs 标签页：
- 点击标签切换路由
- 标签右侧显示关闭按钮（仪表盘不可关闭）
- 右键标签显示上下文菜单：刷新页面 / 关闭当前 / 关闭其他 / 关闭全部
- Tabs 状态通过 `appStore.visitedViews` 管理

## 动态面包屑

`Breadcrumb` 组件根据当前路由的 `matched` 自动生成面包屑导航：
- 自动读取路由 `meta.title`
- 点击面包屑可跳转对应路由

## Screenfull 全屏

`Screenfull` 组件封装了 screenfull 库，点击顶部栏全屏按钮即可切换浏览器全屏模式。

## 富文本编辑器

`RichEditor` 组件通过 CDN 引入 TinyMCE：
- CDN 地址：`https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js`
- 中文语言包：`https://cdn.jsdelivr.net/npm/tinymce@7/langs/zh_CN.js`
- 支持工具栏：格式、加粗、斜体、对齐、列表、撤销/重做等

## Pinia Store 设计

### 通用 CRUD 接口

每个业务 Store 都实现了统一的 CRUD 接口：

```ts
interface CrudStore<T> {
  list: T[]           // 当前页数据
  total: number       // 总条数
  loading: boolean    // 加载状态
  query: QueryParams  // 查询参数
  current: T | null   // 当前编辑项
  loadData(): Promise<void>
  create(item: Omit<T, 'id' | 'createTime'>): Promise<T>
  update(item: T): Promise<void>
  remove(ids: number[]): Promise<void>
}
```

### useCrud 组合式函数

```ts
import { useCrud } from '@/composables/useCrud'
import { useUserStore } from '@/stores/user'

const store = useUserStore()
const crud = useCrud(store)

// 提供的响应式数据和方法：
// crud.dialogVisible   // 弹窗显示状态
// crud.dialogTitle     // 弹窗标题
// crud.formModel       // 表单数据（reactive）
// crud.selectedIds     // 批量选中 ID
// crud.openDialog(title, row?)  // 打开弹窗
// crud.closeDialog()   // 关闭弹窗
// crud.handleSearch()  // 查询
// crud.handleReset()   // 重置
// crud.handlePageChange(page)  // 分页
// crud.handleSave()    // 保存
// crud.handleDelete(row)       // 删除
// crud.handleBatchDelete()     // 批量删除
// crud.handleSelectionChange(rows)  // 选择变化
```

### usePermission 组合式函数

```ts
import { usePermission } from '@/composables/usePermission'

const { check } = usePermission()
check('user:delete') // boolean
```

## 权限系统

### 路由级权限

```ts
{
  path: '/user',
  component: UserList,
  meta: { permissions: ['user:list'] }
}
```

路由守卫会检查 `meta.permissions`，未登录跳转登录页，无权限跳转 401 页。

### 按钮级权限

```vue
<w-button v-if="auth.hasPermission('user:create')">新增</w-button>
```

### 菜单权限

侧边栏菜单根据 `mockMenus` 的 `permissions` 字段过滤，只显示用户有权限的菜单。

### 角色权限映射

```ts
const mockUsers = [
  { username: 'admin', password: 'admin', role: 'admin', permissions: ['*'] },
  { username: 'editor', password: 'editor', role: 'editor', permissions: ['dashboard', 'user:list', 'article:list', 'article:create', 'article:edit', 'order:list'] },
  { username: 'viewer', password: 'viewer', role: 'viewer', permissions: ['dashboard', 'user:list', 'article:list', 'order:list'] }
]
```

## 个人中心

`/profile` 页面包含三个标签页：
- **基本信息**：查看/修改昵称、邮箱、手机号
- **修改密码**：原密码、新密码、确认密码验证
- **系统配置**：打开抽屉面板，配置语言、主题色、组件大小，支持恢复默认

## 扩展组件

| 组件 | 说明 |
|------|------|
| Breadcrumb | 动态面包屑，根据路由 matched 生成 |
| LangSelect | 语言切换按钮（中文/英文） |
| ThemeSetting | 主题设置按钮，打开配置抽屉 |
| Screenfull | 全屏切换按钮 |
| RichEditor | 基于 TinyMCE CDN 的富文本编辑器 |
