# 阶段三：低代码核心（在线开发）

## 目标

实现低代码平台核心能力：通过配置生成业务功能，无需手写代码。

## 功能清单

- 数据模型管理：业务模型（对应物理表）增删改查
- 字段管理：为模型定义字段（类型、长度、必填、默认值、选项）
- 表单设计器：配置表单字段与规则，生成表单 JSON
- 列表设计器：配置展示列、查询条件、操作按钮
- 动态 CRUD：根据模型配置自动生成增删改查 API
- 编码规则：自动生成业务编号
- 校验规则：自定义正则校验规则

## 任务清单

- [x] 设计并实现低代码元数据表
- [x] 实现后端数据模型与字段管理 API
- [x] 实现后端动态 CRUD API（/lowcode/:modelCode）
- [x] 实现后端编码规则与校验规则 API
- [x] 实现 lowcode-admin 数据模型管理页面
- [x] 实现 lowcode-admin 表单设计器与列表设计器
- [x] 实现 lowcode-admin 动态业务页面渲染
- [x] 更新路由、菜单与种子数据
- [x] 构建与联调验证

## 元数据表设计

| 表名 | 说明 |
|------|------|
| lowcode_models | 数据模型：code/name/table_name/status |
| lowcode_fields | 模型字段：model_id/field_name/display_name/type/length/required/default/options/sort |
| lowcode_forms | 表单配置：model_id/name/config(JSON) |
| lowcode_tables | 列表配置：model_id/name/config(JSON) |
| lowcode_coding_rules | 编码规则：code/name/prefix/date_format/seq_length/current_seq |
| lowcode_validation_rules | 校验规则：code/name/pattern/message |

## 动态 API 约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /lowcode/:modelCode | 查询列表（支持分页、关键词、字段筛选） |
| GET | /lowcode/:modelCode/:id | 查询详情 |
| POST | /lowcode/:modelCode | 新增数据 |
| PUT | /lowcode/:modelCode/:id | 更新数据 |
| DELETE | /lowcode/:modelCode/:id | 删除数据 |

## 验收标准

- 可在界面上创建数据模型并自动生成物理表
- 可为模型配置字段
- 表单设计器可配置并预览表单
- 列表设计器可配置并预览列表
- 动态页面可真实增删改查数据
- `pnpm build:server` 与 `pnpm build:lowcode` 通过

## 运行记录

- 2026-06-13：完成低代码元数据表迁移与后端 API
- 2026-06-13：完成 ModelList / ModelDesigner / LowcodePage 前端页面
- 2026-06-13：完成编码规则、校验规则前后端页面
- 2026-06-13：联调通过：创建 customer 模型 → 添加 name/phone 字段 → 保存表单/列表 → 动态新增/查询数据
