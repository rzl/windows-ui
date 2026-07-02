# 阶段三十三：页面设计器增强

## 目标

在 phase-14 自定义页面设计器基础上，增强低代码页面能力：扩展更多内置组件、提供可视化事件配置、支持页面级权限控制。

## 功能清单

### 1. 更多内置页面组件

新增常用展示与布局组件：

- `image`：图片组件，支持配置图片地址、宽度、高度、对象适应方式、点击事件。
- `divider`：分隔线，支持配置文字、方向、边距。
- `table`：表格组件，支持静态数据或数据源驱动，可配置列与分页。
- `list`：列表组件，支持图标、标题、描述与数据源。

### 2. 交互事件可视化配置

统一事件编辑器，支持为按钮、图片、链接等组件配置以下动作：

- `navigate`：内部路由跳转，target 为路径。
- `openDialog`：打开弹窗，target 为页面编码或外部 URL。
- `callApi`：调用自定义接口，target 为接口路径，可配置请求方法与参数。
- `setVariable`：设置页面级变量，供其他组件读取。
- `refresh`：刷新当前页面数据源。
- `goBack`：返回上一页。
- `openExternal`：打开外部链接，target 为完整 URL。

页面运行器维护 `pageState` 上下文，事件执行时可读取和修改变量，数据源脚本可通过 `ctx.state` 访问变量。

### 3. 页面权限控制

- `lowcode_pages` 表新增 `permission` 字段。
- 页面列表支持填写权限码。
- 页面运行器在渲染前校验当前用户是否拥有该权限码，无权限时显示「无权访问」。
- 应用发布菜单时，若页面配置了权限码，则菜单权限码同步使用该值。

## 数据表

### lowcode_pages（新增字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| permission | string | 页面权限码，为空表示不限制 |

## 接口约定

无新增接口，复用现有 `/api/pages/*` 接口。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/server/migrations/20260702040000_add_page_permission.ts` | 页面权限字段迁移 |
| `sop/progress/by-phase/phase-33.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/server/src/modules/page/page.service.ts` | 支持 permission 字段读写 |
| `packages/server/src/modules/app/app.service.ts` | 页面菜单使用页面自定义权限码 |
| `packages/lowcode-admin/src/views/lowcode/PageList.vue` | 增加权限码输入与展示 |
| `packages/lowcode-admin/src/views/lowcode/PageDesigner.vue` | 新增内置组件入口 |
| `packages/lowcode-admin/src/components/page-designer/ComponentNode.vue` | 新增组件画布预览 |
| `packages/lowcode-admin/src/components/page-designer/PropertyEditor.vue` | 新增组件属性与统一事件编辑器 |
| `packages/lowcode-admin/src/components/page-designer/RenderComponent.vue` | 渲染新组件并执行事件 |
| `packages/lowcode-admin/src/components/page-designer/PageRenderer.vue` | 维护 pageState 与权限校验 |
| `sop/progress/README.md` | 添加 phase-33 |
| `sop/progress/by-feature/page-designer/README.md` | 更新子线状态 |
| `sop/manuals/lowcode/page-designer.md` | 更新用户手册 |
| `sop/lowcode/page-designer.md` | 更新设计规范 |
| `sop/database/schema.md` | 更新 lowcode_pages 表结构 |

## 任务清单

- [x] 数据库迁移：lowcode_pages 新增 permission 字段
- [x] 后端：page.service 支持 permission 字段
- [x] 后端：app.service 发布页面菜单时应用自定义权限码
- [x] 前端：PageList 增加权限码输入
- [x] 前端：PageDesigner 增加 image / divider / table / list 组件
- [x] 前端：PropertyEditor 增加新组件属性与统一事件编辑器
- [x] 前端：RenderComponent 渲染新组件并执行事件
- [x] 前端：PageRenderer 维护 pageState 并校验页面权限
- [x] 文档：阶段进度文档与用户手册
- [x] 验证：`pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode`

## 验收标准

1. [x] 页面设计器组件库新增 image、divider、table、list 组件，可拖拽使用。
2. [x] 新组件属性面板可正常配置。
3. [x] 按钮/图片等组件可通过事件编辑器配置跳转、弹窗、调用接口、设置变量等动作。
4. [x] 页面级变量在事件与数据源中可正确读写。
5. [x] 页面配置权限码后，无权限用户访问页面运行器时提示无权访问。
6. [x] 应用发布包含页面时，菜单权限码与页面权限码一致。
7. [x] `pnpm db:migrate`、`pnpm build:server`、`pnpm build:lowcode` 通过。

## 运行记录

- 2026-07-02：完成迁移、后端字段与菜单权限、前端组件扩展与事件编辑器、`pageState` 与权限校验，同步 SOP 文档，构建验证通过。

## 风险与待决策

1. **事件动作扩展性**：当前动作硬编码在渲染器中，后续动作较多时可改为插件化动作注册表。
2. **弹窗组件**：`openDialog` 当前使用页面编码加载 `PageRenderer`，复杂弹窗场景下可进一步扩展弹窗尺寸与标题配置。
3. **权限校验位置**：当前在页面运行器前端校验，敏感场景建议后端 `/api/pages/:code` 接口也做权限校验。
