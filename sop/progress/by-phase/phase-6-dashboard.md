# 阶段六：首页配置与仪表盘设计器

## 目标

实现可配置的首页与仪表盘设计器，用户可以通过拖拽/配置方式定义首页展示的组件与图表。

## 功能清单

- 首页配置：配置首页展示的卡片、快捷入口、公告等
- 仪表盘设计器：通过 iframe 嵌入 ECharts，配置图表数据源与展示方式
- 仪表盘列表：管理多个仪表盘页面
- 动态首页：根据配置渲染首页内容

## 任务清单

- [x] 设计并实现首页配置与仪表盘配置数据表
- [x] 实现后端首页配置与仪表盘设计 API
- [x] 实现 lowcode-admin 仪表盘设计器（iframe ECharts）
- [x] 实现可配置的首页展示
- [x] 支持仪表盘数据源动态化（SQL / API / 在线脚本）
- [x] 更新路由、菜单与种子数据
- [x] 构建与联调验证

## 数据表设计

| 表名 | 说明 |
|------|------|
| homepage_configs | 首页配置：widgets 数组（JSON） |
| dashboards | 仪表盘：code/name/config(JSON)/status |

## 数据源类型

| 类型 | 说明 |
|------|------|
| static | 静态 ECharts option |
| sql | 执行 SELECT 查询，通过转换脚本生成 option |
| api | 调用内部 API，通过转换脚本生成 option |
| script | 在线编写 JavaScript，直接返回 option |

## 验收标准

- 可在首页配置中添加快捷入口、统计卡片、公告
- 可使用仪表盘设计器创建 ECharts 图表
- 仪表盘通过 iframe 嵌入并渲染 ECharts
- 首页根据配置动态展示内容
- `pnpm build:server` 与 `pnpm build:lowcode` 通过

## 运行记录

- 2026-06-13：完成首页配置与仪表盘设计器基础版本
- 2026-06-13：完成仪表盘数据源动态化，支持 SQL / API / 在线脚本三种数据源
