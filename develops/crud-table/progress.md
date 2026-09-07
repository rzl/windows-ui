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
- [x] 工具栏左右结构：左侧 toolbar 插槽，右侧列设置入口（齿轮图标打开抽屉，支持字段显隐、冻结、顺序调整、重置，storage-key 持久化）

## 待优化项

- [ ] 支持列操作按钮内置封装
- [ ] 支持批量删除确认弹窗
- [ ] 支持更多 WTable 属性透传

## 变更记录

- 2026-06-13：初始实现
- 2026-06-24：新增移动端响应式适配（≤768px），包含工具栏自动换行、分页居中，以及内部 dialog/table/form/search-form/query-builder/dynamic-form/pagination 的移动端行为适配。
- 2026-06-29: 统一尺寸规范：新增 size 支持，组件高度与内部图标随尺寸联动（small/default/large）
- 2026-09-07：工具栏改为左右结构，右侧新增列设置弹窗（字段显隐 / 顺序调整 / 重置），配置随 storage-key 持久化；表头拖拽排序结果同步回列设置；新增 columnSetting 属性可关闭入口；补充 6 个单元测试
- 2026-09-07：列设置弹窗新增字段冻结配置（不冻结 / 冻结至左侧 / 冻结至右侧），随配置持久化；补充 1 个单元测试
- 2026-09-07：列设置抽屉内的字段配置由自定义列表改为带表头的 WTable 表格（显示 / 字段名称 / 冻结 / 操作），测试同步更新选择器
