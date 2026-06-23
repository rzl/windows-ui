# 子线：应用运行门户

## 来源阶段

[phase-13：应用运行门户 / 工作台](../../by-phase/phase-13.md)

## 目标

为每个应用提供可配置的工作台门户，支持 Widget 组件展示。

## 关键实现

- `lowcode_apps.portal_config` 字段
- list / portal 双模式
- 统计卡片、快捷链接、仪表盘、公告、流程待办、应用资源入口等 Widget
- 通用 Widget 组件库抽取

## 验收标准

- [x] 应用设计器可配置门户
- [x] 工作台正确渲染各类 Widget
- [x] 示例模板安装后默认展示工作台门户
