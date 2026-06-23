# 子线：外部数据源管理

## 来源阶段

[phase-9：打印模板设计器 + 表单高级布局 + 外部数据集成](../../by-phase/phase-9.md)

## 目标

管理 REST API 与外部数据库数据源。

## 关键实现

- `external_data_sources` 表
- REST 数据源：URL、方法、Headers、参数映射、响应解析
- 数据库数据源：host、port、database、user、password、SQL
- 测试连接与数据预览

## 验收标准

- [x] 可创建 REST 或数据库外部数据源
- [x] 可测试连接并预览返回数据
