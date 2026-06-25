# 阶段二十五：列表设计器增强（列宽记忆 + 列排序拖拽）

## 目标

提升运行时数据列表的用户体验：用户在列表页拖拽调整列宽后，刷新页面仍能保持列宽；同时支持拖拽表头调整列的顺序，并记忆当前用户的列顺序偏好。

## 功能清单

### 1. 列宽记忆

- `w-table` 组件新增 `storageKey` prop。
- 当用户拖拽调整列宽后，将列宽映射保存到 `localStorage`。
- 组件初始化时，如果存在对应 `storageKey` 的列宽记录，优先使用保存的列宽。
- 提供 `resetColumnWidths` 方法（通过 ref 暴露），允许调用方重置列宽。

### 2. 列排序拖拽

- `w-table` 组件新增 `columnDraggable` prop。
- 启用后，表头单元格可拖拽，用户可通过拖拽调整列顺序。
- 拖拽完成后触发 `column-order-change` 事件，并保存当前列顺序到 `localStorage`。
- 组件初始化时，如果存在对应 `storageKey` 的列顺序记录，按保存顺序渲染列。
- 固定列（`fixed: left/right`）和选择列不参与拖拽排序。

### 3. CRUD 表格与低代码运行页集成

- `w-crud-table` 透传 `storageKey` 和 `columnDraggable` 到内部 `w-table`。
- `LowcodePage.vue` 传入 `storageKey="lowcode-table-<modelCode>"`，启用列宽记忆和列排序拖拽。

### 4. 数据格式

localStorage key：`w-table-<storageKey>`

value：

```json
{
  "widths": { "name": 120, "age": 80 },
  "order": ["age", "name"]
}
```

## 新增文件

| 文件 | 说明 |
|------|------|
| `sop/progress/by-phase/phase-25.md` | 本阶段进度文档 |
| `sop/manuals/lowcode/table-enhance.md` | 用户手册 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/windows-ui/src/components/table/table.vue` | 增加 storageKey、columnDraggable、列宽记忆、列排序拖拽 |
| `packages/windows-ui/src/components/crud-table/crud-table.vue` | 透传新属性与事件 |
| `packages/lowcode-admin/src/views/lowcode/LowcodePage.vue` | 启用列宽记忆与列排序拖拽 |
| `sop/progress/README.md` | 添加 phase-25 |
| `sop/progress/by-feature/table-designer/README.md` | 更新状态 |

## 接口与事件

### w-table 新增 props

| prop | 类型 | 说明 |
|------|------|------|
| storageKey | string | localStorage 存储键前缀 |
| columnDraggable | boolean | 是否启用列拖拽排序 |

### w-table 新增事件

| 事件 | 参数 | 说明 |
|------|------|------|
| column-order-change | string[] | 列顺序变化后触发 |

### w-table 新增方法（通过 ref）

| 方法 | 说明 |
|------|------|
| resetColumnWidths | 清除当前 storageKey 下保存的列宽与顺序 |

## 任务清单

- [x] w-table 增加 `storageKey` 与列宽持久化
- [x] w-table 增加 `columnDraggable` 与列排序拖拽
- [x] w-crud-table 透传新属性与事件
- [x] LowcodePage 启用列宽记忆与列排序拖拽
- [x] 文档：编写阶段进度文档与用户手册
- [ ] 验证：`pnpm build`、`pnpm --filter @windows-ui/core test`、`pnpm build:lowcode`

## 验收标准

1. [x] 在 LowcodePage 列表页拖拽调整列宽后刷新页面，列宽保持不变。
2. [x] 拖拽表头调整列顺序后刷新页面，列顺序保持不变。
3. [x] 固定列和选择列不参与拖拽排序。
4. [x] 清除 localStorage 后，列表恢复设计器配置的默认列宽与顺序。
5. [x] `w-table` 单元测试通过（209 个用例全部通过）。
6. [x] `pnpm build`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **多级表头**：列排序拖拽暂不处理多级表头场景，仅支持单层表头。
2. **虚拟滚动横向**：开启 `virtualX` 时，列拖拽排序逻辑需确保渲染列顺序正确，当前先假设 `virtualX=false` 场景。
3. **localStorage 键冲突**：使用 `w-table-<storageKey>` 作为键，业务方需保证 `storageKey` 唯一。
