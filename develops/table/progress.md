# Table 表格 - 开发进度

## 状态
已完成（Phase 1 核心数据交互 + Phase 2 布局与行级交互 + Phase 3-1 列宽拖拽 + Phase 3-2 树形表格 + Phase 3-3 多级表头 + Phase 3-4 虚拟滚动）

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
- [x] 列宽拖拽调整（鼠标 + 触摸，所有列默认可拖拽）
- [x] 列宽记忆（storageKey + localStorage 持久化）
- [x] 列排序拖拽（columnDraggable + 表头拖拽调整顺序）
- [x] 自适应列宽（最后一个未设 width 的普通列自动填充剩余空间）
- [x] 树形表格（children 嵌套数据扁平化渲染 + 展开/收起）
- [x] 树形懒加载（lazy + load 方法异步获取子节点）
- [x] 树形多选联动（父子选中状态自动同步 + 半选状态）
- [x] 多级表头（columns 嵌套 children + rowspan/colspan 自动计算）
- [x] 虚拟滚动（固定行高 + 可视区域渲染 + 上下占位行 + 与固定列兼容）
- [x] 横向虚拟滚动（virtual-x + 左右固定列 + 占位列保持宽度 + 与纵向虚拟滚动兼容）
- [x] 移动端响应式适配（≤768px 横向滚动 + 单元格内容不换行）

## 待优化项（Phase 3）
- [x] 树形数据（tree-props + lazy + default-expand-all + 父子多选联动）
- [x] 多级表头（children 嵌套列 + rowspan/colspan）
- [x] 虚拟滚动与固定列混合
- [ ] 行拖拽排序
- [ ] 键盘导航与 ARIA 属性完善
- [ ] 单元测试覆盖（Vitest + @vue/test-utils）
- [ ] 国际化支持（empty-text 接入 ConfigProvider）

## 变更记录
- 2024-06-01: 初始版本实现（基础数据展示 + 列插槽 + 空状态）
- 2026-06-06: Phase 1 增强（行选择、排序、筛选、事件体系、斑马纹、尺寸、列宽对齐、行样式、分页联动示例）
- 2026-06-06: Phase 2 增强（固定表头、固定列、展开行）
- 2026-06-06: Phase 3-1 增强（列宽拖拽调整 + 自适应列宽）
- 2026-06-06: Phase 3-2 增强（树形表格、懒加载、父子多选联动）
- 2026-06-06: Phase 3-3 增强（多级表头、与固定列/拖拽兼容）
- 2026-06-06: Phase 3-4 增强（虚拟滚动、与固定列/表头兼容）
- 2026-06-12: 统一尺寸规范：新增 size 支持，组件高度与内部图标随尺寸联动（small/default/large）
- 2026-06-24: 新增移动端响应式适配（≤768px 横向滚动，单元格内容不换行，避免列宽被压缩）
- 2026-06-25: 新增列宽记忆（storageKey）与列排序拖拽（columnDraggable），支持 localStorage 持久化及 resetColumnWidths 重置
