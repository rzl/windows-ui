# 子线：仪表盘设计器

## 来源阶段

[phase-6：首页配置与仪表盘设计器](../../by-phase/phase-6-dashboard.md)

## 目标

通过 iframe 嵌入 ECharts，配置图表数据源与展示方式。

## 关键实现

- `dashboards` 表
- 后端仪表盘设计 API
- 前端仪表盘设计器
- 仪表盘独立运行路由 `/dashboard/run/:code`

## 验收标准

- [x] 可使用仪表盘设计器创建 ECharts 图表
- [x] 仪表盘通过 iframe 嵌入并渲染
