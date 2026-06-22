# Config Provider 全局配置 - 开发进度

## 状态
已完成

## 实现清单
- [x] 基础结构实现
- [x] Windows XP 样式设计
- [x] Props 定义
- [x] Events 定义
- [x] 基础交互逻辑
- [x] 示例代码

## 待优化项
- [ ] 单元测试覆盖
- [ ] 性能优化
- [ ] 无障碍支持完善
- [x] 国际化支持

## 变更记录
- 2026-06-22: 全量支持 light / dark / auto 主题模式，`WConfigProvider` 新增 `mode` prop；默认背景色由 `#ece9d8` 改为 `#ffffff`；新增 `html.dark` 暗黑调色盘与全局 `dark.css` 覆盖表，playground、admin、lowcode-admin 同步支持模式切换与持久化
- 2026-06-12: 新增国际化支持。内置 `zh-CN` / `en-US` 语言包，语言文件为单层键值对；`WConfigProvider` 新增 `locale` prop，支持全局/局部配置；`app.use(WindowsUI, { locale, messages })` 支持全局注入；导出 `useLocale`、`setGlobalLocale`、`registerLocale` 等 API
- 2024-06-01: 初始版本实现
- 2026-06-06: 新增 `size` 全局配置支持，旗下组件（Button、Input、Tag、Text、Avatar、Icon）未传入 `size` 时将自动继承全局尺寸
- 2026-06-06: 新增 `theme` 全局主题配置支持，可通过 `primary`、`success`、`warning`、`danger`、`info`、`bgColor`、`textColor` 等键动态修改主题色；同步将 Button、Link、Progress、Rate、Card、Dialog、MessageBox、Tour、Drawer 等组件的硬编码主题色替换为 CSS 变量
- 2026-06-06: 修复 `config-provider.vue` 缺少 `defineOptions({ name: 'WConfigProvider' })` 导致组件注册失效的问题
- 2026-06-06: 主题色同时通过 `:style` 绑定与 `document.documentElement.style.setProperty` 两种途径生效，确保普通组件与 `<teleport>` 组件（Dialog、Drawer、MessageBox）均能继承
- 2026-06-06: 深浅衍生色改为 JS 计算生成，移除对 CSS `color-mix()` 的依赖，提升浏览器兼容性
- 2026-06-06: Playground 演示页面顶部新增全局尺寸切换与主题色选择器
- 2026-06-12: 统一尺寸规范：新增 size 支持，组件高度与内部图标随尺寸联动（small/default/large）
