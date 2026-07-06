# 主功能：自定义页面设计器

## 目标

提供拖拽式自定义页面设计能力，页面可作为应用资源被引用、随应用发布并在应用门户中访问。

## 子线清单

| 子线 | 阶段 | 内容 | 状态 |
|------|------|------|------|
| 页面设计器 | [phase-14](../../by-phase/phase-14.md) | 左侧组件库、中间画布、右侧属性面板 | ✅ |
| 页面运行器 | [phase-14](../../by-phase/phase-14.md) | 递归渲染组件树 | ✅ |
| 页面数据源 | [phase-14](../../by-phase/phase-14.md) | static/sql/api/script 数据源执行 | ✅ |
| 应用集成 | [phase-14](../../by-phase/phase-14.md) | 页面作为 AppItem 加入应用 | ✅ |
| 页面设计器增强 | [phase-33](../../by-phase/phase-33.md) | 更多内置组件、事件可视化配置、页面权限控制 | ✅ |

## 已完成增强

- [x] 属性面板 Schema 化：`propertySchema` 驱动，内置组件与插件组件均可声明可视化属性配置。
- [x] 事件动作插件化注册表：通过 `registerAction` 注册自定义动作，事件编辑器自动读取动作字段 schema。
- [x] 复杂弹窗配置：`openDialog` 动作支持 `dialogOptions` 配置宽度、高度、全屏、footer 显示。
- [x] 栅格改用 WRow/WCol：拖拽到 row 自动用 col 包装，支持 span/offset/gutter/justify/align。
- [x] 标签页改用 WTabs/WTabPane：标签配置使用 `{ label, name }`，渲染与组件库保持一致。
- [x] 移动端设计器优化：画布节点支持长按选中，底部固定操作条提供上移/下移/删除。

## 待增强

- [ ] 页面模板市场
