# 低代码平台核心设计

> 本文档汇总低代码平台的核心设计文档，便于理解系统原理、进行二次开发和重构。

## 文档索引

| 文档 | 说明 |
|---|---|
| [metadata.md](./metadata.md) | 元数据模型设计（模型、字段、表单、列表、编码规则、校验规则） |
| [dynamic-api.md](./dynamic-api.md) | 动态 CRUD API 约定与实现机制 |
| [designer-spec.md](./designer-spec.md) | 表单设计器与列表设计器配置规范 |

## 核心流程

低代码平台通过以下流程将数据模型转换为可运行的业务页面：

```
创建数据模型 -> 添加字段 -> 设计表单 -> 设计列表 -> 运行动态页面
```

1. **数据模型**：定义业务实体，对应一张物理表。
2. **字段**：定义表字段，同步创建到物理表。
3. **表单配置**：决定新增/编辑时显示哪些字段、使用什么组件、是否必填。
4. **列表配置**：决定表格显示哪些列、列宽、哪些字段可查询。
5. **动态页面**：读取上述配置，自动渲染 CRUD 页面。

## 关键文件

- 低代码前端：`packages/lowcode-admin/src/views/lowcode/`
- 低代码后端：`packages/server/src/modules/lowcode/`
- 通用组件：`packages/windows-ui/src/components/{crud-table,dynamic-form,query-builder}/`
