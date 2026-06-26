# 阶段二十八：表单设计器增强

## 目标

增强低代码表单设计器的联动能力，支持可视化配置多条件、多动作联动规则，并扩展字段默认值来源，实现跨表单数据引用。

## 功能清单

### 1. 可视化联动规则设计器

- 在模型「表单设计」标签页新增「联动规则」列。
- 每个字段可配置多条联动规则。
- 每条规则包含：
  - 条件组：一个或多个条件，支持 AND / OR 组合。
  - 动作组：一个或多个动作。
- 支持的条件运算符：
  - `eq` / `ne`：等于 / 不等于
  - `gt` / `gte` / `lt` / `lte`：大于 / 大于等于 / 小于 / 小于等于
  - `contains` / `notContains`：包含 / 不包含
  - `empty` / `notEmpty`：为空 / 不为空
  - `in` / `notIn`：在列表中 / 不在列表中
- 支持的动作：
  - `show` / `hide`：显示 / 隐藏字段
  - `required` / `unrequired`：必填 / 非必填
  - `enable` / `disable`：启用 / 禁用
  - `setValue`：设置字段值
  - `clear`：清空字段值
  - `filterOptions`：过滤下拉/单选/级联选项

### 2. 运行时联动规则引擎

- `WDynamicForm` 内部维护联动状态（hidden / required / disabled / filteredOptions）。
- 监听字段值变化，自动评估联动规则并执行动作。
- 多条规则按顺序执行，后执行的动作覆盖前者。
- 保留原有 `dependsOn` 简单联动能力，与新规则共存。

### 3. 跨表单数据引用

扩展字段默认值来源：

- `currentUser`：当前登录用户 ID
- `currentDept`：当前用户部门 ID
- `currentRole`：当前用户角色 ID
- `currentTime`：当前时间
- `field`：本表单其他字段值
- `urlParam`：URL 查询参数
- `parentField`：父表单字段值（用于子表场景）
- `expr`：自定义表达式
- `constant`：常量

### 4. 表单设计器 UI 调整

- 字段管理新增默认值类型：当前角色、URL 参数、父表单字段。
- 表单设计新增「联动规则」配置按钮，点击打开弹窗编辑规则。
- 弹窗支持添加/删除规则、条件、动作。

### 5. 低代码运行页集成

- `LowcodePage.vue` 中 `WDynamicForm` 传入 `userInfo` 与 `urlParams`。

## 数据模型

联动规则直接存储在 `lowcode_forms` 表的 `config` JSON 中，字段配置示例：

```json
{
  "field": "invoice_title",
  "label": "发票抬头",
  "type": "input",
  "linkageRules": [
    {
      "logic": "and",
      "conditions": [
        { "field": "need_invoice", "operator": "eq", "value": "1" }
      ],
      "actions": [
        { "type": "show" },
        { "type": "required" }
      ]
    }
  ]
}
```

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/lowcode-admin/src/components/model-designer/LinkageRuleDialog.vue` | 可视化联动规则设计器弹窗 |
| `sop/progress/by-phase/phase-28.md` | 本阶段进度文档 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/windows-ui/src/components/dynamic-form/dynamic-form.vue` | 扩展类型、联动规则引擎、跨表单默认值 |
| `packages/windows-ui/src/index.ts` | 导出 LinkageRule / LinkageCondition / LinkageAction 类型 |
| `packages/windows-ui/src/components/dynamic-form/dynamic-form.spec.ts` | 新增联动规则单元测试 |
| `packages/lowcode-admin/src/views/lowcode/ModelDesigner.vue` | 集成联动规则设计器、扩展默认值类型 |
| `packages/lowcode-admin/src/views/lowcode/LowcodePage.vue` | WDynamicForm 传入 userInfo / urlParams |
| `sop/manuals/lowcode/form-designer.md` | 更新用户手册 |
| `sop/progress/README.md` | 添加 phase-28 |
| `sop/progress/by-feature/form-designer/README.md` | 更新子线状态 |

## 任务清单

- [x] 设计联动规则数据结构
- [x] WDynamicForm 实现联动规则引擎
- [x] WDynamicForm 支持跨表单数据引用默认值
- [x] 创建 LinkageRuleDialog 可视化设计器
- [x] ModelDesigner 集成联动规则设计器
- [x] 扩展字段默认值类型
- [x] LowcodePage 传入运行时上下文
- [x] 新增单元测试
- [x] 更新用户手册与进度文档
- [x] 验证：`pnpm build`、`pnpm --filter @windows-ui/core test`、`pnpm build:lowcode`

## 验收标准

1. [x] 表单设计器支持配置多条件、多动作联动规则。
2. [x] 运行时根据字段值自动执行显示/隐藏、必填/非必填、启用/禁用、设值/清空、过滤选项等动作。
3. [x] 字段默认值支持当前角色、URL 参数、父表单字段。
4. [x] 原有 `dependsOn` 简单联动保持兼容。
5. [x] `WDynamicForm` 新增联动规则单元测试通过。
6. [x] `pnpm build`、`pnpm --filter @windows-ui/core test`、`pnpm build:lowcode` 通过。

## 风险与待决策

1. **循环设值**：`setValue` 动作可能触发其他规则的 `setValue`，导致循环。当前由 Vue 响应式自动处理，极端情况下可能死循环，后续可增加规则执行深度限制。
2. **动作冲突**：同一字段多条规则配置冲突动作时，后执行的规则覆盖前者，需在文档中说明。
3. **过滤选项持久化**：`filterOptions` 动作在运行时会覆盖动态加载的选项，保存表单配置时不会持久化运行时过滤结果。
4. **父表单字段**：`parentField` 需要运行时在子表/嵌套表单中传入 `parentModel`，当前 LowcodePage 主表单未使用子表场景，后续子表扩展时接入。
