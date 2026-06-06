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
- [ ] 国际化支持

## 变更记录
- 2024-06-01: 初始版本实现
- 2026-06-06: 新增 `size` 全局配置支持，旗下组件（Button、Input、Tag、Text、Avatar、Icon）未传入 `size` 时将自动继承全局尺寸
- 2026-06-06: 新增 `theme` 全局主题配置支持，可通过 `primary`、`success`、`warning`、`danger`、`info`、`bgColor`、`textColor` 等键动态修改主题色；同步将 Button、Link、Progress、Rate、Card、Dialog、MessageBox、Tour、Drawer 等组件的硬编码主题色替换为 CSS 变量
- 2026-06-06: 修复 `config-provider.vue` 缺少 `defineOptions({ name: 'WConfigProvider' })` 导致组件注册失效的问题
- 2026-06-06: 主题色同时通过 `:style` 绑定与 `document.documentElement.style.setProperty` 两种途径生效，确保普通组件与 `<teleport>` 组件（Dialog、Drawer、MessageBox）均能继承
- 2026-06-06: 深浅衍生色改为 JS 计算生成，移除对 CSS `color-mix()` 的依赖，提升浏览器兼容性
- 2026-06-06: Playground 演示页面顶部新增全局尺寸切换与主题色选择器
