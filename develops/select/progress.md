# Select 选择器 - 开发进度

## 状态
已完成

## 实现清单
- [x] 基础结构实现
- [x] Windows XP 样式设计
- [x] Props 定义
- [x] Events 定义
- [x] 基础交互逻辑
- [x] clearable 清空支持
- [x] filterable 搜索支持
- [x] 示例代码
- [x] 单元测试覆盖
- [x] 多选支持
- [x] 远程搜索支持
## 待优化项
- [x] 多选支持
- [x] 远程搜索支持
- [ ] 性能优化（大数据量虚拟化已拆分为 WVirtualizedSelect）
- [ ] 无障碍支持完善
- [ ] 国际化支持

## 变更记录
- 2024-06-01: 初始版本实现
- 2026-06-07: 新增 clearable 支持，默认开启，新增 clear 事件
- 2026-06-12: 统一尺寸规范：新增 size 支持，组件高度与内部图标随尺寸联动（small/default/large）
- 2026-06-19: 新增 filterable 属性，支持在选择器 trigger 中直接输入搜索过滤选项
- 2026-06-19: 新增 filterMethod 属性，支持自定义搜索过滤函数
- 2026-06-29: 新增多选（multiple）、远程搜索（remote + remoteMethod）支持
