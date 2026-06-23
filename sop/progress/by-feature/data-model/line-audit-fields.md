# 子线：审计字段

## 来源阶段

[phase-7（子项）：数据权限与审计字段](../../by-phase/phase-7-data-permission-audit.md)

## 目标

动态物理表自动包含审计字段，记录创建人、部门、修改人和时间。

## 关键实现

- 物理表增加 `create_by`、`dept_id`、`update_by`、`create_time`、`update_time`
- 新增/更新数据时自动填充

## 验收标准

- [x] 数据新增/更新后审计字段自动填充
- [x] 支持数据权限中的部门隔离
