# WDynamicForm 设计文档

## 组件分类

Form / 低代码表单组件

## 视觉设计

- 使用 WForm + WFormItem 布局
- 多列时使用 CSS Grid 排列
- 保留 XP 风格表单边框与背景

## 交互设计

- 根据字段类型自动渲染对应组件
- 支持字段级 disabled/hidden 动态规则
- 支持 required 与自定义 rules 校验
- custom 类型通过插槽由调用方实现

## 可访问性

- 每个表单项都有 label
- 必填项通过规则校验提示
