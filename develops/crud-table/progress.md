# WCrudTable 开发进度

## 状态

已完成

## 实现清单

- [x] 封装 WSearchForm + WTable + WPagination
- [x] 支持查询、重置、分页、选择事件
- [x] 支持自定义查询区、工具栏、列插槽
- [x] 在 windows-ui/src/index.ts 注册并导出
- [x] 编写 docs/designs/develops 三份文档
- [x] 移动端响应式适配（≤768px 工具栏换行、分页居中，集成 dialog/table/form/search-form/query-builder/dynamic-form/pagination 移动端行为）

## 待优化项

- [ ] 支持列操作按钮内置封装
- [ ] 支持批量删除确认弹窗
- [ ] 支持更多 WTable 属性透传

## 变更记录

- 2026-06-13：初始实现
- 2026-06-24：新增移动端响应式适配（≤768px），包含工具栏自动换行、分页居中，以及内部 dialog/table/form/search-form/query-builder/dynamic-form/pagination 的移动端行为适配。
