# 子线：数据源动态化

## 来源阶段

[phase-6：首页配置与仪表盘设计器](../../by-phase/phase-6-dashboard.md)

## 目标

支持静态、SQL、API、在线脚本等多种数据源。

## 关键实现

- static / sql / api / script 四种数据源类型
- 后端执行 SELECT、调用内部 API、运行在线脚本
- 通过转换脚本生成 ECharts option

## 验收标准

- [x] 仪表盘数据源支持 SQL / API / 在线脚本
- [x] 执行结果可转换为图表 option
