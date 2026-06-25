# 阶段二十二：物理表字段删除

## 目标

SQLite 不支持 `ALTER TABLE ... DROP COLUMN`，因此当前删除模型字段时仅移除了 `lowcode_fields` 元数据，物理表中对应列仍然存在。本阶段通过重建物理表的方式真正删除列，保持元数据与物理表结构一致，并清理不再使用的历史数据。

## 功能清单

### 1. 物理表重建能力

- 新增通用表重建工具函数 `rebuildTableWithoutColumns(tableName, columnsToRemove)`：
  1. 查询当前物理表的所有列。
  2. 创建临时表，结构为原表去掉待删除列。
  3. 将保留列的数据从原表复制到临时表。
  4. 删除原表。
  5. 将临时表重命名为原表名。
  6. 恢复索引（主键由 `increments` 自动处理）。
- 支持 SQLite 环境，其他数据库可回退到原生 `ALTER TABLE DROP COLUMN`。
- 重建过程中临时关闭 SQLite 外键检查，避免级联约束干扰。

### 2. 字段删除增强

- 扩展 `lowcode.service.ts` 的 `deleteField`：
  - 删除 `lowcode_fields` 元数据前，校验该字段是否被关联关系引用（`source_field` 或 `target_field`）。
  - 若被引用，返回 400 错误并提示先解除关系。
  - 删除元数据后，调用表重建函数移除物理表列。
- 新增批量删除字段接口 `POST /fields/batch-delete`：
  - 接收字段 ID 数组。
  - 统一校验后一次性重建物理表，避免多次重建。

### 3. 前端体验

- 字段删除弹窗增加二次确认，明确提示：
  - 该操作会从物理表中删除对应列。
  - 该列的历史数据将丢失且不可恢复。
- 若字段被关联关系引用，禁用删除按钮并显示 Tooltip 提示。
- 删除成功后刷新字段列表。

### 4. 兼容与安全

- 保留系统字段（`id`、`create_time`、`update_time`、`create_by`、`dept_id`）不被删除。
- 重建表前对原表结构做备份记录到日志（可选）。
- 若重建表失败，抛出错误并不删除元数据，保证事务一致性。
- 批量删除时如果任一字段校验失败，整体不执行。

## 数据表

无需新增表，复用现有 `lowcode_models`、`lowcode_fields`、`lowcode_model_relations`。

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| DELETE | /api/lowcode/fields/:id | 删除单个字段并重建物理表 |
| POST | /api/lowcode/fields/batch-delete | 批量删除字段并重建物理表 |

批量删除请求体：

```json
{ "ids": [1, 2, 3] }
```

## 核心实现思路

### SQLite 表重建流程

```sql
-- 1. 获取原表列信息
PRAGMA table_info(lc_order)

-- 2. 创建临时表
CREATE TABLE lc_order_temp (...保留列...)

-- 3. 复制数据
INSERT INTO lc_order_temp (保留列) SELECT 保留列 FROM lc_order

-- 4. 删除原表
DROP TABLE lc_order

-- 5. 重命名
ALTER TABLE lc_order_temp RENAME TO lc_order
```

### 字段引用校验

删除字段前检查 `lowcode_model_relations`：

```sql
SELECT * FROM lowcode_model_relations
WHERE (source_model = ? AND source_field = ?)
   OR (target_model = ? AND target_field = ?)
```

若存在记录，则禁止删除。

### 批量删除

1. 查询所有待删除字段及所属模型。
2. 校验所有字段是否属于同一模型（不同模型无法通过一次重建完成）。
3. 校验每个字段是否被关系引用。
4. 删除所有元数据记录。
5. 一次性重建物理表，移除多个列。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/utils/rebuildTable.ts` | SQLite 表重建工具函数 |
| `packages/server/src/modules/lowcode/field.service.ts` | 字段删除/批量删除业务逻辑（若不存在则写入 lowcode.service.ts） |
| `sop/progress/by-phase/phase-22.md` | 本阶段进度文档 |
| `sop/manuals/lowcode/field-delete.md` | 字段删除用户手册 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/lowcode.service.ts` | `deleteField` 增加关系引用校验与表重建 |
| `packages/server/src/modules/lowcode/lowcode.controller.ts` | 新增 `batchDeleteFields` 控制器 |
| `packages/server/src/modules/lowcode/lowcode.routes.ts` | 注册批量删除路由 |
| `packages/lowcode-admin/src/api/lowcode.ts` | 新增批量删除 API |
| `packages/lowcode-admin/src/views/lowcode/ModelDesigner.vue` | 字段删除提示、关系引用禁用、批量删除入口 |
| `sop/progress/by-feature/data-model/README.md` | 更新物理表字段删除状态 |
| `sop/progress/README.md` | 添加 phase-22 |

## 任务清单

- [x] 实现 SQLite 表重建工具函数
- [x] 扩展 `deleteField`：关系引用校验 + 表重建
- [x] 后端：新增批量删除字段接口
- [x] 后端：注册批量删除路由
- [x] 前端：字段删除二次确认与数据丢失提示
- [x] 前端：被关系引用时禁用删除并提示
- [x] 前端：批量删除字段入口
- [x] 文档：编写阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 删除字段后，物理表中对应列被移除。
2. [x] 删除字段后，其他字段数据保留。
3. [x] 被关联关系引用的字段无法删除，并给出明确提示。
4. [x] 批量删除同模型多个字段时，只重建一次物理表。
5. [x] 系统保留字段（id、create_time、update_time、create_by、dept_id）不会被误删。
6. [x] 表重建失败时，字段元数据不被删除，业务不中断。
7. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **数据丢失**：删除列会永久丢失该列历史数据，需在前端做充分提示。
2. **大表重建**：数据量较大时重建表可能耗时，建议后续增加异步任务或进度提示。
3. **索引与约束**：当前物理表主要由低代码平台自动创建，索引较少。若后续增加自定义索引，重建表时需同步恢复。
4. **触发器/视图**：若业务手动在物理表上创建了触发器或视图，重建表后会丢失，本阶段暂不考虑。
