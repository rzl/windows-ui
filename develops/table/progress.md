# Table 表格 - 开发进度

## 状态
已完成（Phase 1 核心数据交互 + Phase 2 布局与行级交互）

## 实现清单
- [x] 基础结构实现
- [x] Windows XP 样式设计
- [x] Props 定义（data、columns、stripe、border、size、highlightCurrentRow、rowClassName、emptyText、maxHeight、expandRowKeys）
- [x] Column 配置扩展（width、minWidth、align、className、sortable、filters、filterMethod、type、fixed）
- [x] Events 定义（row-click、row-dblclick、cell-click、selection-change、select、select-all、sort-change、filter-change、current-change、expand-change）
- [x] Slots 定义（列插槽、header-[prop]、empty、expand）
- [x] 行选择（多选 + 单选高亮）
- [x] 排序（内部自动排序 + 自定义排序事件）
- [x] 筛选（筛选面板 + 多选值 + 自定义匹配）
- [x] 斑马纹与边框
- [x] 尺寸规格（small / default / large）
- [x] 行样式自定义（row-class-name）
- [x] 固定表头（max-height + sticky thead）
- [x] 固定列（left / right sticky + 累积偏移 + 阴影分隔）
- [x] 展开行（expand 列 + 插槽 + 受控 keys）
- [x] 示例代码与 Playground 演示
- [x] 文档同步更新

## 待优化项（Phase 3）
- [ ] 树形数据（tree-props + lazy）
- [ ] 虚拟滚动与固定列混合
- [ ] 行拖拽排序
- [ ] 键盘导航与 ARIA 属性完善
- [ ] 单元测试覆盖（Vitest + @vue/test-utils）
- [ ] 国际化支持（empty-text 接入 ConfigProvider）

## 变更记录
- 2024-06-01: 初始版本实现（基础数据展示 + 列插槽 + 空状态）
- 2026-06-06: Phase 1 增强（行选择、排序、筛选、事件体系、斑马纹、尺寸、列宽对齐、行样式、分页联动示例）
- 2026-06-06: Phase 2 增强（固定表头、固定列、展开行）
