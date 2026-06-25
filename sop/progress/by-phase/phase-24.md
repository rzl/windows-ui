# 阶段二十四：自定义接口版本管理

## 目标

为自定义接口提供版本快照与回滚能力。管理员在修改自定义接口脚本前可保存快照，脚本出错或需要还原时可快速恢复到历史版本，降低自定义接口配置变更风险。

## 功能清单

### 1. 版本元数据

- 新增 `lowcode_custom_api_versions` 表：
  - `id`：主键
  - `api_id`：自定义接口 ID
  - `version`：版本号
  - `description`：版本说明
  - `snapshot`：快照 JSON（包含 name、method、path、description、script、status、is_public）
  - `is_published`：是否当前生效版本
  - `create_time`：创建时间

### 2. 后端能力

- 新增 `custom-api-version.service.ts`：
  - 创建自定义接口快照
  - 查询自定义接口版本列表
  - 删除指定版本
  - 回滚到指定版本（覆盖接口当前配置）
- 新增 `custom-api-version.controller.ts` 与路由：
  - `GET /api/custom-apis/:id/versions`：版本列表
  - `POST /api/custom-apis/:id/versions`：创建快照
  - `POST /api/custom-apis/:id/versions/:versionId/rollback`：回滚
  - `DELETE /api/custom-apis/:id/versions/:versionId`：删除版本

### 3. 前端能力

- 在「自定义接口编辑器」（`CustomApiEditor.vue`）新增「版本」Tab：
  - 展示历史版本列表。
  - 支持创建快照（输入版本号与说明）。
  - 支持回滚到历史版本（覆盖当前编辑器内容）。
  - 支持删除历史版本。
- 在「自定义接口列表」（`CustomApiList.vue`）增加「版本」按钮，可打开版本抽屉。

### 4. 兼容与默认行为

- 未创建版本的接口行为保持不变。
- 快照为只读历史记录，回滚是显式操作。
- 回滚后接口立即生效（因为接口执行读取当前 `script`）。

## 数据表

### lowcode_custom_api_versions

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK | 自增主键 |
| api_id | int | 接口 ID，外键 |
| version | varchar(50) | 版本号 |
| description | varchar(500) | 版本说明 |
| snapshot | json/text | 快照 JSON |
| is_published | tinyint | 1 当前生效，0 历史版本 |
| create_time | timestamp | 创建时间 |

## 接口约定

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/custom-apis/:id/versions | 版本列表 |
| POST | /api/custom-apis/:id/versions | 创建快照 |
| POST | /api/custom-apis/:id/versions/:versionId/rollback | 回滚到指定版本 |
| DELETE | /api/custom-apis/:id/versions/:versionId | 删除版本 |

## 核心实现思路

### 创建快照

1. 读取 `lowcode_custom_apis` 中该接口记录。
2. 将字段快照序列化为 JSON。
3. 写入 `lowcode_custom_api_versions`。
4. 新创建版本标记为 `is_published = 1`，其他版本标记为 `0`。

### 回滚版本

1. 读取目标版本快照。
2. 更新 `lowcode_custom_apis` 的 name、method、path、description、script、status、is_public。
3. 标记目标版本为 `is_published = 1`。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260626010000_create_lowcode_custom_api_versions.ts` | 版本表迁移 |
| `packages/server/src/modules/custom-api/custom-api-version.service.ts` | 版本业务逻辑 |
| `packages/server/src/modules/custom-api/custom-api-version.controller.ts` | 版本控制器 |
| `packages/lowcode-admin/src/api/custom-api-version.ts` | 前端版本 API 封装 |
| `packages/lowcode-admin/src/views/lowcode/CustomApiVersionPanel.vue` | 版本面板 |
| `sop/progress/by-phase/phase-24.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/custom-api/custom-api.routes.ts` | 注册版本路由 |
| `packages/lowcode-admin/src/views/lowcode/CustomApiEditor.vue` | 新增「版本」Tab |
| `packages/lowcode-admin/src/views/lowcode/CustomApiList.vue` | 增加「版本」按钮 |
| `sop/progress/README.md` | 添加 phase-24 |
| `sop/progress/by-feature/custom-api/README.md` | 更新状态 |
| `sop/manuals/lowcode/custom-api-version.md` | 用户手册 |

## 任务清单

- [x] 数据库迁移：创建 `lowcode_custom_api_versions` 表
- [x] 后端：自定义接口版本 CRUD 与回滚服务
- [x] 后端：注册版本路由
- [x] 前端：自定义接口版本 API 封装
- [x] 前端：自定义接口编辑器新增「版本」Tab
- [x] 前端：自定义接口列表增加版本入口
- [x] 文档：编写阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 管理员可在自定义接口编辑器中创建接口快照。
2. [x] 版本列表展示所有历史快照及当前生效版本。
3. [x] 回滚到历史版本后，接口配置（脚本、路径、方法等）立即恢复。
4. [x] 删除版本不影响当前接口配置。
5. [x] 未创建版本的接口行为保持不变。
6. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **回滚即时生效**：自定义接口执行时读取当前 `script`，回滚后新请求立即使用旧脚本，需在前端提示。
2. **并发编辑**：版本管理不解决多人并发编辑冲突。
3. **大脚本快照**：脚本较长时快照 JSON 较大，当前 SQLite text 字段足够容纳。
