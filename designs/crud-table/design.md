# WCrudTable 设计文档

## 组件分类

Others / 管理后台通用组件

## 视觉设计

- 查询区域：继承 WSearchForm 的 XP 风格边框与背景
- 工具栏：位于表格上方，按钮横向排列，间距 8px
- 表格：继承 WTable 的条纹、边框、固定列等样式
- 分页：位于表格右下方，继承 WPagination 样式

## 交互设计

- 点击"查询"触发 search 事件
- 点击"重置"清空查询条件并触发 reset 事件
- 分页切换触发 page-change / size-change 事件
- 表格选择变化通过 selection-change 抛出

## 可访问性

- 按钮使用语义化标签
- 表单项使用 label 关联
