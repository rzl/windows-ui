# 阶段二十一：数据模型版本管理

## 目标

在现有数据模型能力基础上，为单个模型提供版本快照、历史回溯与一键回滚能力。业务人员可以在调整模型字段、表单、列表配置前保存快照，配置出错或需要还原时快速恢复到历史版本，降低低代码平台配置变更风险。

## 功能清单

### 1. 模型版本元数据

- 新增 `lowcode_model_versions` 表，存储模型级版本快照：
  - `id`：主键
  - `model_id`：模型 ID
  - `version`：版本号，如 `v1.0.0`
  - `description`：版本说明
  - `snapshot`：快照 JSON
  - `is_published`：是否当前生效版本（0 / 1）
  - `create_time`：创建时间
- 快照内容包含：
  - `model`：模型基础信息（`name`、`description`、`status`、`enable_audit`、`data_permission`）
  - `fields`：该模型下全部字段配置
  - `forms`：该模型下全部表单配置
  - `tables`：该模型下全部列表配置
  - `relations`：以该模型为 `source_model` 或 `target_model` 的关联关系

### 2. 后端能力

- 新增 `model-version.service.ts`：
  - 创建模型快照（读取当前模型完整配置并序列化）
  - 查询模型版本列表
  - 删除指定版本
  - 回滚到指定版本（恢复模型基础信息、字段、表单、列表、关联关系）
- 新增 `model-version.controller.ts` 与路由：
  - `GET /api/lowcode/models/:id/versions`：版本列表
  - `POST /api/lowcode/models/:id/versions`：创建快照
  - `POST /api/lowcode/models/:id/versions/:versionId/rollback`：回滚
  - `DELETE /api/lowcode/models/:id/versions/:versionId`：删除版本
- 回滚策略：
  - 模型基础信息直接覆盖。
  - 字段按 `field_name` 匹配：新增缺失字段、更新已有字段、删除快照中不存在的字段（仅删除元数据，不删除物理表列）。
  - 表单/列表配置：删除旧配置后按快照重新插入。
  - 关联关系按 `code` 匹配：更新或创建，不回删全局关系。

### 3. 前端能力

- 在「模型设计器」新增「版本」Tab：
  - 展示历史版本列表（版本号、说明、创建时间、是否当前版本）。
  - 支持「创建快照」：输入版本号与说明。
  - 支持「回滚到此版本」：二次确认后调用回滚接口并刷新设计器。
  - 支持「删除版本」。
- 创建快照时自动携带当前模型、字段、表单、列表、关联关系数据。

### 4. 兼容与默认行为

- 未启用版本管理的模型行为保持不变。
- 快照为只读历史记录，回滚是显式操作，不会自动覆盖当前配置。
- 物理表列在回滚时只增不减，删除的字段仅移除元数据，保证历史业务数据不丢失。
- 数据权限与字段权限等运行时配置不参与快照，避免回滚影响全局权限策略。

## 数据表

### lowcode_model_versions

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| model_id | int | 模型 ID，外键 |
| version | varchar(50) | 版本号 |
| description | varchar(500) | 版本说明 |
| snapshot | json/text | 快照 JSON |
| is_published | tinyint | 1 当前生效，0 历史版本 |
| create_time | timestamp | 创建时间 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/lowcode/models/:id/versions | 版本列表 |
| POST | /api/lowcode/models/:id/versions | 创建快照 |
| POST | /api/lowcode/models/:id/versions/:versionId/rollback | 回滚到指定版本 |
| DELETE | /api/lowcode/models/:id/versions/:versionId | 删除版本 |

## 核心实现思路

### 创建快照

1. 读取 `lowcode_models` 中该模型记录。
2. 读取该模型下所有 `lowcode_fields`、`lowcode_forms`、`lowcode_tables`。
3. 读取 `source_model` 或 `target_model` 等于该模型编码的 `lowcode_model_relations`。
4. 将数据序列化为 JSON 后写入 `lowcode_model_versions`。
5. 将新创建版本标记为 `is_published = 1`，其他版本标记为 `0`。

### 回滚版本

1. 读取目标版本快照。
2. 更新模型基础信息（`name`、`description`、`status`、`enable_audit`、`data_permission`）。
3. 字段回滚：
   - 以快照中 `field_name` 为基准。
   - 新增：调用字段创建逻辑（同步物理表列）。
   - 更新：调用字段更新逻辑（尝试修改列）。
   - 删除：删除元数据记录（不删除物理表列）。
4. 表单/列表回滚：删除旧记录，按快照重新插入。
5. 关联关系回滚：按 `code` 匹配，更新或创建，不删除全局关系。
6. 将目标版本标记为 `is_published = 1`。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260625010000_create_lowcode_model_versions.ts` | 模型版本表迁移 |
| `packages/server/migrations/20260625010100_add_model_version_menu.ts` | 新增「版本」权限点（复用模型设计器入口，无需新增菜单） |
| `packages/server/src/modules/lowcode/model-version.service.ts` | 模型版本业务逻辑 |
| `packages/server/src/modules/lowcode/model-version.controller.ts` | 模型版本控制器 |
| `packages/lowcode-admin/src/api/model-version.ts` | 前端模型版本 API 封装 |
| `packages/lowcode-admin/src/views/lowcode/ModelVersionPanel.vue` | 模型设计器版本 Tab 面板 |
| `sop/progress/by-phase/phase-21.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/lowcode/lowcode.routes.ts` | 注册模型版本路由 |
| `packages/server/src/modules/lowcode/field.service.ts`（如存在）或 `lowcode.service.ts` | 提供按字段名创建/更新字段的复用函数 |
| `packages/lowcode-admin/src/views/lowcode/ModelDesigner.vue` | 新增「版本」Tab，集成 `ModelVersionPanel` |
| `packages/server/seeds/01_init_data.ts` | 如需新增权限码则补充 |
| `sop/progress/by-feature/data-model/README.md` | 更新模型版本管理子线状态 |
| `sop/manuals/lowcode/model-version.md` | 用户手册（可选） |

## 任务清单

- [x] 数据库迁移：创建 `lowcode_model_versions` 表
- [x] 后端：模型版本 CRUD 与回滚服务
- [x] 后端：注册模型版本路由
- [x] 后端：复用/拆分字段创建与更新逻辑
- [x] 前端：模型版本 API 封装
- [x] 前端：模型设计器新增「版本」Tab
- [x] 文档：编写阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 管理员可在模型设计器中创建模型快照，输入版本号与说明。
2. [x] 版本列表展示所有历史快照及当前生效版本。
3. [x] 回滚到历史版本后，模型基础信息、字段、表单、列表恢复为快照状态。
4. [x] 回滚时新增字段会自动同步到物理表，删除字段仅移除元数据。
5. [x] 删除版本不影响当前模型配置。
6. [x] 未创建版本的模型行为保持不变。
7. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **关联关系回滚范围**：快照中包含以该模型为源或目标的关系，但关系是全局资源，回滚时只更新/新增，不删除，避免影响其他模型。
2. **物理表列同步**：新增字段时同步物理表列；删除字段不回删列。若回滚后重新新增同名列但类型不同，可能因物理列类型不兼容失败，需在前端提示。
3. **并发编辑**：模型版本管理不解决多人并发编辑冲突，仅提供单用户配置回溯能力。
4. **大数据量字段**：模型字段较多时快照 JSON 可能较大，当前 SQLite text 字段足够容纳。
