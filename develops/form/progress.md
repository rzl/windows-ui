# Form 表单 - 开发进度

## 状态
已完成

## 实现清单
- [x] 基础结构实现
- [x] Windows XP 样式设计
- [x] Props 定义
- [x] Events 定义
- [x] 基础交互逻辑
- [x] 示例代码
- [x] 验证规则支持（required, pattern, min, max, validator）
- [x] validate / resetFields / clearValidate 方法
- [x] 移动端响应式适配（≤768px 时 label 与内容区纵向堆叠，label 宽度自适应）
- [x] 异步验证支持（validator 返回 Promise）
## 待优化项
- [ ] 单元测试覆盖
- [ ] 性能优化
- [ ] 无障碍支持完善
- [ ] 国际化支持
- [x] 异步验证支持

## 变更记录
- 2024-06-01: 初始版本实现
- 2026-06-08: 增强验证功能（rules、validate、resetFields、clearValidate）
- 2026-06-12: 统一尺寸规范：新增 size 支持，组件高度与内部图标随尺寸联动（small/default/large）
- 2026-06-24: 新增移动端响应式适配，≤768px 时表单项 label 与内容区纵向堆叠，label 宽度自适应
- 2026-06-29: 新增异步验证支持：rules 中 validator 可返回 Promise
- 2026-06-29: 补齐文档中已声明但缺失的 Props/API（如 size、border、contentPosition、preview-src-list、row/col 等）
- 2026-10-15: 表单容器默认去掉右边框与底边框，仅保留顶部/左侧 2px 白色凸起边，便于嵌入对话框等容器
- 2026-10-15: 校验体系重写：新增 change 触发（form-item 监听 model 自动校验）与 blur 触发（w-input 内置），rules 支持 trigger 字段过滤；新增 validateField / clearValidate(fields) 方法；resetFields 改为恢复挂载时初始值（原实现会把字段清成 undefined）；移除未使用的 fieldRefs 注册死代码；默认错误文案接入 i18n
