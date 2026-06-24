# 低代码管理平台移动端适配规范

## 背景与目标

低代码管理平台（`packages/lowcode-admin`）需要在手机、平板等移动设备上可用，以覆盖外出审批、移动办公、现场数据录入等场景。

本文档规范移动端适配的断点、通用原则、组件行为与测试要求，供后续开发与维护参考。

## 断点规范

项目统一使用以下断点：

| 断点名 | 宽度范围 | 说明 |
|--------|----------|------|
| `sm` | ≤576px | 手机竖屏 |
| `md` | ≤768px | 手机横屏 / 小平板 |
| `lg` | ≤992px | 平板 |
| `xl` | >992px | 桌面端 |

代码中通过 `packages/lowcode-admin/src/composables/useScreen.ts` 获取响应式状态：

```ts
import { useScreen } from '@/composables/useScreen'

const { isMobile, isTablet, screenWidth } = useScreen()
```

## 布局适配原则

### 1. 全局布局

- 屏幕宽度 ≤768px 时，左侧侧边栏切换为抽屉式（fixed + 遮罩），默认隐藏。
- Header 右侧功能区简化为图标按钮，用户昵称、退出文字隐藏。
- Tab 标签栏保持横向滚动，但最小触控高度不低于 32px。

### 2. 列表页

- 搜索区域：字段垂直排列，操作按钮换行。
- 工具栏：允许换行，避免按钮被截断。
- 数据表格：启用横向滚动，单元格内容不换行，确保所有列可查看。
- 分页：总条数文字隐藏，允许整体换行。

### 3. 表单页

- 表单项 label 与内容区纵向堆叠。
- 动态表单（`w-dynamic-form`）在移动端自动降为单列，可通过 `mobileColumns` prop 调整。
- 弹窗表单在移动端自动全屏，用户可手动退出全屏；退出全屏后支持拖拽。

### 4. 设计器页面

- 页面设计器（PageDesigner）：三栏布局改为标签页切换（组件库 / 画布 / 属性）。
- 仪表盘设计器（DashboardDesigner）：双栏布局垂直堆叠。
- 报表设计器（ReportDesigner）：工具栏换行，表格区域可横向滚动。

## 组件移动端行为速查

| 组件 | 移动端行为 |
|------|------------|
| `w-dialog` | ≤768px 自动全屏；支持退出全屏；退出后支持拖拽；切回桌面端恢复之前状态 |
| `w-table` | 横向滚动；单元格 `white-space: nowrap`；不压缩列宽 |
| `w-form` / `w-form-item` | label 与内容区纵向堆叠 |
| `w-search-form` | 字段垂直排列；操作按钮换行 |
| `w-query-builder` | 条件行垂直堆叠；控件占满宽度 |
| `w-dynamic-form` | 自动单列；新增 `mobileColumns` prop |
| `w-pagination` | 隐藏总条数文字；允许换行 |
| `w-crud-table` | toolbar 换行；分页居中；内部表格横向滚动 |

## 开发 checklist

新增或修改低代码平台页面时，请确认以下事项：

- [ ] 页面容器是否有合适的内边距（移动端 6px，桌面端 8px）。
- [ ] 工具栏是否允许换行（`flex-wrap: wrap`）。
- [ ] 表格是否在窄屏下可横向滚动。
- [ ] 搜索/查询区域是否在窄屏下纵向堆叠。
- [ ] 弹窗内的表单在移动端是否能正常显示（建议配合 `w-dialog` 自动全屏）。
- [ ] 是否使用了 `useScreen` 而非直接读取 `window.innerWidth`。

## 测试要求

- 使用 Chrome DevTools 模拟 iPhone SE（375px）、iPad（768px）进行视觉检查。
- 核心路径必须可完成：登录 → 仪表盘 → 列表页 → 弹窗表单 → 保存。
- 运行 `pnpm --filter @windows-ui/core test` 确保 UI 库测试通过。
- 运行 `pnpm build:lowcode` 确保低代码后台构建无 TypeScript 错误。

## 相关文件

- `packages/lowcode-admin/src/composables/useScreen.ts`
- `packages/lowcode-admin/src/stores/app.ts`
- `packages/lowcode-admin/src/views/layout/LowcodeLayout.vue`
- `packages/windows-ui/src/components/dialog/dialog.vue`
- `packages/windows-ui/src/components/table/table.vue`
- `packages/windows-ui/src/components/form/form-item.vue`
- `packages/windows-ui/src/components/search-form/search-form.vue`
- `packages/windows-ui/src/components/query-builder/query-builder.vue`
- `packages/windows-ui/src/components/dynamic-form/dynamic-form.vue`
- `packages/windows-ui/src/components/pagination/pagination.vue`
- `packages/windows-ui/src/components/crud-table/crud-table.vue`

## 变更记录

- 2026-06-24：制定初始移动端适配规范，并完成低代码管理平台首轮移动端适配改造。
