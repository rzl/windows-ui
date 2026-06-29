# AdminLayout 管理布局 - 使用说明

## 基础用法

```vue
<template>
  <w-config-provider :size="app.size" :theme="app.theme">
    <div class="admin-layout">
      <!-- 侧边栏 -->
      <aside class="admin-sidebar" :class="{ collapsed: app.sidebarCollapsed }">
        <div class="sidebar-logo">
          <w-icon name="computer" />
          <span v-show="!app.sidebarCollapsed">Admin</span>
        </div>
        <w-menu
          :items="menuItems"
          mode="vertical"
          :collapse="app.sidebarCollapsed"
          :default-active="route.path"
          @select="handleMenuSelect"
        />
      </aside>

      <!-- 主内容区 -->
      <div class="admin-main">
        <!-- 顶部栏 -->
        <header class="admin-header">
          <div class="header-left">
            <w-button size="small" @click="app.toggleSidebar">
              <w-icon name="menu" size="small" />
            </w-button>
            <Breadcrumb />
          </div>
          <div class="header-right">
            <Screenfull />
            <div class="user-dropdown">
              <div class="user-trigger">
                <w-icon name="user" size="small" />
                <span>{{ auth.userInfo?.nickname }}</span>
                <w-icon :name="showUserMenu ? 'arrowUp' : 'arrowDown'" size="small" />
              </div>
              <div class="user-menu">
                <div class="user-menu-item" @click="goProfile">
                  <w-icon name="user" size="small" /> 个人中心
                </div>
                <div class="user-menu-item" @click="handleLogout">
                  <w-icon name="logout" size="small" /> 退出登录
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Tabs 标签栏 -->
        <div class="tab-bar">
          <div
            v-for="tab in app.visitedViews"
            :key="tab.path"
            :class="['tab-item', { active: route.path === tab.path }]"
            @click="router.push(tab.path)"
          >
            <span>{{ tab.title }}</span>
            <w-icon
              v-if="tab.path !== '/dashboard'"
              name="close"
              size="small"
              class="tab-close"
              @click.stop="closeTab(tab)"
            />
          </div>
        </div>

        <!-- 页面内容 -->
        <main class="admin-content">
          <router-view />
        </main>
      </div>
    </div>
  </w-config-provider>
</template>
```

## 功能特性

### 1. 侧边栏菜单
- 使用 `w-menu` 组件渲染菜单，支持 `mode="vertical"` 和 `:collapse` 收起状态
- 支持三级嵌套菜单，收起时鼠标悬浮弹出子菜单
- 根据用户权限动态过滤菜单（`visibleMenus` computed）
- 菜单数据通过 `transformMenu` 转换为 `w-menu` 的 `items` 格式（`path` → `value`）
- `@select` 事件中通过 `router.push(value)` 完成导航
- 展开/收起状态通过 `app.sidebarCollapsed` 控制
- 宽度：展开 220px，收起 64px，带过渡动画

### 2. 顶部栏
- **左侧**：侧边栏收起按钮 + 动态面包屑（`Breadcrumb` 组件）
- **右侧**：全屏按钮（`Screenfull` 组件）+ 系统配置按钮（打开抽屉面板）+ 用户下拉菜单（个人中心 / 退出登录）

### 3. Tabs 标签页
- 自动收集已访问路由，显示在顶部栏下方
- 点击标签切换路由
- 关闭按钮移除标签（仪表盘不可关闭）
- 右键标签显示上下文菜单：刷新 / 关闭当前 / 关闭其他 / 关闭全部

### 4. 权限集成
- 菜单过滤：`visibleMenus` 根据 `auth.hasPermission()` 过滤 `mockMenus`
- 路由守卫：未登录跳转登录页，无权限跳转 401 页

### 5. 主题集成
- 包裹 `WConfigProvider`，动态传入 `app.size` 和 `app.theme`
- 支持全局组件大小和主题色切换

## 数据结构

### 菜单项
```ts
interface MenuItem {
  name: string        // 路由名称
  path: string        // 路由路径
  label: string       // 显示文本
  icon?: string       // 图标名（对应 WIcon 的 name）
  permissions: string[] // 所需权限码
  children?: MenuItem[] // 子菜单
}
```

### Tabs 项
```ts
interface TabItem {
  name: string   // 路由 name
  path: string   // 路由 path
  title: string  // 显示标题（来自 route.meta.title）
}
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| collapsed | - | boolean | false |
| title | 标题 | string | Admin |
| size | 尺寸 | string | default（继承全局 size） |
| tabs | - | array | [] |
| activeTab | - | string |  |
| breadcrumb | - | array | [] |
| userInfo | - | object | {} |
| userMenu | - | array | {} |
| showUserDropdown | - | boolean | true |
| showScreenfull | - | boolean | true |
| showMenuSearch | - | boolean | true |
| favorites | - | array | [] |
| drawerBreakpoint | - | number | 768 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:collapsed | - | - |
| tab-change | - | - |
| tab-close | - | - |
| screenfull | - | - |
| menu-search | - | - |
| user-command | - | - |
| logout | - | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| header-actions | 自定义内容 |
| logo | 自定义内容 |
| menu | 菜单插槽 |
| toggle | 自定义内容 |

## 主题定制

可通过 CSS 变量自定义主题色：

```css
:root {
  --w-color-primary: #245edb;
  --w-bg-color: #ece9d8;
  --w-text-color-primary: #000;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```
