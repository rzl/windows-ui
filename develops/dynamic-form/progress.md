# WDynamicForm 开发进度

## 状态

已完成（基础版本）

## 实现清单

- [x] 支持 input/number/textarea/select/radio/checkbox/switch/date/datetime/upload/cascader/rich-text 类型
- [x] 支持 `ref` 关联模型/关联关系字段类型（refModel / refDisplayField / refRelation / refFilter）
- [x] 支持 required/rules 校验
- [x] 支持后端校验规则（validationRule + validateRules）
- [x] 暴露 validate 方法供父组件调用
- [x] 支持字段联动（dependsOn）动态显示/隐藏
- [x] 支持 disabled/hidden 动态函数
- [x] 支持 custom 类型插槽
- [x] 在 windows-ui/src/index.ts 注册并导出
- [x] 编写 docs/designs/develops 三份文档
- [x] 支持移动端响应式适配（≤768px 自动单列、mobileColumns prop）

## 待优化项

- [ ] 支持 tree-select 等复杂字段
- [ ] 支持分组/分步骤表单

## 变更记录

- 2026-06-13：初始实现
- 2026-06-13：新增后端校验规则支持（validationRule + validateRules），暴露 validate 方法
- 2026-06-13：新增字段联动支持（dependsOn），支持 eq/ne/empty/notEmpty 四种条件
- 2026-06-13：新增 upload / cascader / rich-text 三种字段类型
- 2026-06-24：新增移动端响应式适配，≤768px 时 grid 布局自动降为 1 列，新增 mobileColumns prop
- 2026-06-25：新增 `ref` 字段对关联关系（refRelation）的支持，loadRefOptions 增加 relationCode 参数
