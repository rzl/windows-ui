# WAdvancedQueryBuilder 开发进度

## 状态

已完成

## 实现清单

- [x] 创建 `packages/windows-ui/src/components/advanced-query-builder/advanced-query-builder.vue`
- [x] 创建递归子组件 `packages/windows-ui/src/components/advanced-query-builder/advanced-query-group.vue`
- [x] 支持 AND/OR 嵌套条件组
- [x] 支持 14 种运算符：eq、ne、like、notLike、startsWith、endsWith、in、notIn、between、gt、gte、lt、lte、isNull、isNotNull
- [x] 根据字段类型自动过滤可用运算符
- [x] 支持范围值（between）与空值判断（isNull / isNotNull）
- [x] 支持 `modelValue` 受控绑定与 `update:modelValue` 事件
- [x] 提供 `toolbar` 插槽供外部集成常用查询
- [x] 在 `packages/windows-ui/src/index.ts` 注册并导出组件与类型
- [x] 移动端响应式适配
- [x] 字段类型输入组件
- [x] maxLevel
- [x] 自定义运算符
## 待优化项

- [x] 增加最大嵌套层数限制（maxLevel）
- [x] 为不同字段类型渲染更合适的值输入组件（如数字使用 w-input-number、日期使用 w-date-picker）
- [ ] 支持字段选项异步加载
- [x] 支持自定义运算符列表

## 变更记录

| 日期 | 变更内容 |
|------|----------|
| 2026-06-27 | 完成 WAdvancedQueryBuilder 组件及 LowcodePage 集成 |
- 2026-06-29: 新增字段类型输入组件、maxLevel 层级限制与自定义运算符支持
