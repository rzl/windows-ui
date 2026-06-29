# AdminLayout 管理布局 - 设计文档

## 组件分类
Others

## 视觉设计

### 整体布局
- 左侧固定侧边栏（220px，折叠时 64px）
- 顶部栏（自适应高度，默认约 48px）
- Tabs 标签栏（自适应高度，约 32px）
- 右侧内容区（自适应剩余高度）

### 侧边栏
- 背景: `#ece9d8`（XP 米色）
- 边框: 右侧 2px solid `#808080`
- Logo 区域: 主色文字，底部 1px 分隔线 `#d4d0c8`
- 菜单项: 13px 字体，8px 12px 内边距，透明边框
- 选中项: `var(--w-color-primary)` 背景，白色文字，粗体
- 悬停项: `var(--w-xp-blue-light)` 背景，白色文字
- 子菜单缩进: 二级 20px，三级 32px
- 过渡动画: width 0.2s

### 顶部栏
- 背景: `#ece9d8`
- 边框: 底部 2px 凸起边框（`#fff #808080 #808080 #fff`）
- 左侧: 收起按钮 + 面包屑
- 右侧: 全屏按钮 + 用户下拉

### Tabs 标签栏
- 背景: `#f0f0f0`
- 边框: 底部 1px solid `#d4d0c8`
- 标签项: 12px 字体，4px 12px 内边距，米色背景，1px `#d4d0c8` 边框
- 当前标签: `var(--w-color-primary)` 背景，白色文字
- 关闭按钮: 12px，透明度 0.7，悬停 1.0

### 用户下拉菜单
- 背景: `#ece9d8`
- 边框: 1px solid `#808080`
- 阴影: 2px 2px 4px rgba(0,0,0,0.2)
- 菜单项: 13px 字体，8px 12px 内边距，flex 布局带图标
- 悬停: `var(--w-xp-blue-light)` 背景，白色文字

### 右键上下文菜单
- 背景: `#ece9d8`
- 边框: 1px solid `#808080`
- 阴影: 2px 2px 4px rgba(0,0,0,0.2)
- 菜单项: 12px 字体，6px 12px 内边距
- 悬停: `var(--w-xp-blue-light)` 背景，白色文字

### 内容区
- 内边距: 16px
- 背景: `#f5f5f5`
- 溢出: auto

### 色彩规范
- 主色: #245edb (XP Blue)
- 成功色: #3a9e3a
- 警告色: #e4a010
- 危险色: #d92b2b
- 背景色: #ece9d8
- 边框色: #919b9c
- 图标默认色: #000 / #808080

### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动

## 交互设计
- 侧边栏折叠/展开: 宽度过渡动画
- Logo 区域: 文字在折叠时隐藏
- 内容区: 自动适应剩余宽度
- 菜单展开/收起: 箭头图标切换（arrowDown / arrowRight）
- Tabs 切换: 点击跳转路由
- Tabs 关闭: 点击关闭按钮移除，自动跳转到左侧标签
- Tabs 右键: 显示上下文菜单，支持刷新/关闭/关闭其他/关闭全部
- 用户下拉: 点击外部自动关闭（v-click-outside）

## 可访问性
- 支持键盘导航
- 支持屏幕阅读器
