# Config Provider 全局配置 - 设计文档

## 组件分类
Config

## 视觉设计

### 设计理念
该组件采用 Windows XP 经典视觉风格，具有以下设计特征：
- 经典的蓝白配色方案
- 凸起/凹陷的 3D 边框效果
- 渐变标题栏
- Tahoma 字体家族

### 色彩规范
- 主色: #245edb (XP Blue)
- 成功色: #3a9e3a
- 警告色: #e4a010
- 危险色: #d92b2b
- 信息色: #808080
- 背景色: #ffffff（默认），暗黑模式下为 #1e1e1e
- 边框色: #919b9c（默认），暗黑模式下为 #555555
- 支持通过 `theme` 属性动态覆盖主色、成功色、警告色、危险色、信息色、背景色、文字色等
- 深浅衍生色（lighter / light / dark / darker）通过 JS 颜色混合算法自动生成，不再依赖 CSS `color-mix`，保证在旧版浏览器中也能正常渲染
- 标题栏渐变 `--w-xp-title-bar` 随主色动态计算，统一应用于 Card、Dialog、Drawer、MessageBox、Tour 等组件的头部
- 支持通过 `locale` 属性配置全局语言，内置 `zh-CN` / `en-US`，同时支持传入自定义单层语言对象实现多语言扩展
- 支持通过 `mode` 属性切换 `light` / `dark` / `auto` 模式，`auto` 时跟随系统 `prefers-color-scheme`，并在 `html` 根节点上切换 `dark` class

### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动

## 交互设计
- 悬停状态: 颜色加深/高亮
- 点击状态: 内阴影按压效果
- 禁用状态: 透明度 0.5
- 聚焦状态: 蓝色边框高亮

## 可访问性
- 支持键盘导航
- 颜色对比度符合 WCAG 2.0 AA 标准
- 支持屏幕阅读器
