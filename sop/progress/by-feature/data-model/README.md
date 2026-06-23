# 主功能：数据模型与动态 CRUD

## 目标

让业务人员通过配置化的方式定义数据模型、字段和业务规则，系统自动生成物理表和 CRUD API，无需手写代码。

## 子线清单

| 子线 | 阶段 | 内容 | 状态 |
|------|------|------|------|
| 数据模型管理 | [phase-3](../../by-phase/phase-3.md) | 模型增删改查、物理表同步 | ✅ |
| 字段管理 | [phase-3](../../by-phase/phase-3.md) | 字段类型、长度、必填、默认值、选项、字典关联 | ✅ |
| 动态 CRUD | [phase-3](../../by-phase/phase-3.md) | 根据模型配置自动生成增删改查 API | ✅ |
| 编码规则 | [phase-3](../../by-phase/phase-3.md) | 自动生成业务编号 | ✅ |
| 校验规则 | [phase-3](../../by-phase/phase-3.md) | 自定义正则校验规则 | ✅ |
| 审计字段 | [phase-7](../../by-phase/phase-7-data-permission-audit.md) | create_by/dept_id/update_by/create_time/update_time 自动填充 | ✅ |
| 数据审计日志 | [phase-10](../../by-phase/phase-10.md) | 字段级数据变更历史记录 | ✅ |
| 插件字段类型 | [phase-19](../../by-phase/phase-19.md) | 通过插件扩展自定义字段类型 | ✅ |

## 待增强

- [ ] 物理表字段删除（SQLite 不支持 DROP COLUMN，需重建表）
- [ ] 模型版本管理
- [ ] 模型间关联关系（一对多、多对多）
- [ ] 数据模型导入导出
