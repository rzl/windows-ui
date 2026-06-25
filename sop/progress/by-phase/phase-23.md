# 阶段二十三：数据模型导入导出

## 目标

实现数据模型元数据的导入导出能力。与已有的业务数据 Excel 导入导出不同，本阶段面向的是模型本身的配置（模型基础信息、字段、表单、列表、关联关系），支持在不同环境之间迁移模型配置，为应用模板、模型克隆等功能打下基础。

## 功能清单

### 1. 模型导出

- 单个模型导出：
  - `GET /api/lowcode/models/:id/export`
  - 返回 JSON 文件，文件名：`model_<code>_<version>.json`
- 导出内容包含：
  - 模型基础信息（`code`、`name`、`description`、`table_name`、`data_permission`、`enable_audit`、`status`）
  - 字段配置（`lowcode_fields`）
  - 表单配置（`lowcode_forms`）
  - 列表配置（`lowcode_tables`）
  - 关联关系（以该模型为 `source_model` 或 `target_model` 的 `lowcode_model_relations`）

### 2. 模型导入

- `POST /api/lowcode/models/import`
- 请求体为上传的 JSON 文件，包含完整模型配置。
- 导入策略（通过 `conflict` 参数控制）：
  - `skip`（默认）：模型编码已存在时跳过。
  - `overwrite`：覆盖已存在的模型（删除旧字段/表单/列表后重建）。
  - `error`：模型编码已存在时返回错误。
- 导入流程：
  1. 校验 JSON 结构。
  2. 检查 `code` 是否冲突。
  3. 创建模型，自动创建物理表。
  4. 按顺序创建字段并同步物理表列。
  5. 创建表单、列表配置。
  6. 创建关联关系（关系编码冲突时跳过）。

### 3. 前端入口

- 模型列表页（`ModelList.vue`）：
  - 每行增加「导出」按钮。
  - 工具栏增加「导入模型」按钮，弹出文件选择。
- 模型设计器（`ModelDesigner.vue`）：
  - 在「字段管理」Tab 工具栏增加「导出当前模型」按钮。

### 4. 兼容与安全

- 导出文件为纯 JSON，便于版本控制和人工审阅。
- 导入时不允许覆盖系统内置模型（可选）。
- 导入失败时返回详细错误信息，不残留半完成状态。
- 关联关系导入时若目标模型不存在，给出明确提示。

## 数据格式

导出 JSON 示例：

```json
{
  "version": "1.0",
  "exportedAt": "2026-06-25T10:00:00.000Z",
  "model": {
    "code": "customer",
    "name": "客户",
    "table_name": "lc_customer",
    "description": "",
    "data_permission": "all",
    "enable_audit": 0,
    "status": 1
  },
  "fields": [
    {
      "field_name": "name",
      "display_name": "客户名称",
      "type": "string",
      "length": 255,
      "required": 1,
      "sort": 0,
      "status": 1
    }
  ],
  "forms": [
    {
      "name": "默认表单",
      "config": { "fields": [] },
      "status": 1
    }
  ],
  "tables": [
    {
      "name": "默认列表",
      "config": { "fields": [] },
      "status": 1
    }
  ],
  "relations": []
}
```

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/lowcode/models/:id/export | 导出单个模型 |
| POST | /api/lowcode/models/import | 导入模型 JSON |

导入请求：

```http
POST /api/lowcode/models/import?conflict=skip
Content-Type: multipart/form-data

file=<JSON 文件>
```

导入响应：

```json
{
  "code": 200,
  "data": {
    "modelCode": "customer",
    "action": "created"
  },
  "message": "导入成功"
}
```

## 核心实现思路

### 导出

1. 读取模型详情（含 fields/forms/tables）。
2. 读取以该模型为源或目标的关系。
3. 序列化为 JSON 并设置下载响应头。

### 导入

1. 解析上传文件为 JSON。
2. 校验必要字段（`model.code`、`model.table_name`）。
3. 检查冲突：
   - `error`：存在则抛出 400。
   - `skip`：存在则返回 `skipped`。
   - `overwrite`：删除旧模型级联删除字段/表单/列表后重新创建。
4. 创建模型并生成物理表。
5. 创建字段：逐个调用字段创建逻辑，同步物理表列。
6. 创建表单/列表配置。
7. 创建关联关系：关系编码已存在则跳过。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/model-import-export.service.ts` | 导入导出业务逻辑 |
| `sop/progress/by-phase/phase-23.md` | 本阶段进度文档 |
| `sop/manuals/lowcode/model-import-export.md` | 用户手册 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/lowcode.controller.ts` | 新增 `exportModel`、`importModel` 控制器 |
| `packages/server/src/modules/lowcode/lowcode.routes.ts` | 注册导入导出路由 |
| `packages/lowcode-admin/src/api/lowcode.ts` | 新增导入导出 API |
| `packages/lowcode-admin/src/views/lowcode/ModelList.vue` | 导出/导入入口 |
| `packages/lowcode-admin/src/views/lowcode/ModelDesigner.vue` | 导出当前模型按钮 |
| `sop/progress/README.md` | 添加 phase-23 |
| `sop/progress/by-feature/data-model/README.md` | 更新模型导入导出状态 |

## 任务清单

- [x] 后端：模型导出服务
- [x] 后端：模型导入服务（含冲突处理）
- [x] 后端：注册导入导出路由
- [x] 前端：模型导出 API 封装
- [x] 前端：模型导入 API 封装
- [x] 前端：模型列表页导出/导入入口
- [x] 前端：模型设计器导出当前模型按钮
- [x] 文档：编写阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 可在模型列表页导出单个模型为 JSON 文件。
2. [x] 可在模型设计器导出当前模型为 JSON 文件。
3. [x] 导入 JSON 可在新环境中创建完整模型、字段、表单、列表。
4. [x] 冲突策略 `skip` / `overwrite` / `error` 生效。
5. [x] 导入失败时返回明确错误，不残留半完成数据。
6. [x] 关联关系导入时目标模型不存在给出提示。
7. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **表名冲突**：导入时若 `table_name` 已存在，是否需要重命名？本期先按 `code` 冲突策略处理，表名冲突时附加提示。
2. **关联关系目标模型缺失**：导入关系时若目标模型尚未导入，应提示用户先导入依赖模型。
3. **覆盖策略数据风险**：`overwrite` 会删除旧字段元数据并重建物理表，旧字段数据会丢失，需在前端充分提示。
