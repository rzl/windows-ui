# WDynamicForm 设计文档

## 组件分类

Form / 低代码表单组件

## 视觉设计

- 使用 WForm + WFormItem 布局
- 多列时使用 CSS Grid 排列
- 保留 XP 风格表单边框与背景

## 交互设计

- 根据字段类型自动渲染对应组件
- 支持字段级 disabled/hidden 动态规则
- 支持 required 与自定义 rules 校验
- `ref` 类型字段以下拉选择形式展示关联模型/关联关系数据，支持通过 `refModel` / `refDisplayField` 或 `refRelation` 配置数据来源
- custom 类型通过插槽由调用方实现

### 布局渲染引擎

- 字段运行时（`form-runtime.ts`）与布局引擎分离：校验、联动、动态选项、默认值、编码规则等字段行为在 `createFieldRuntime` 中统一实现，布局引擎只负责结构编排。
- `layout` 支持两种 schema：legacy `FormLayout`（root/fieldset/tabs/grid/subtable）与页面设计器节点树 `PageFormLayout`（含 `components`），按形态自动分流，字段行为完全一致。
- PageNode 引擎节点：form-field（字段控件）、form-grid（N 列响应式栅格）、card（分组卡片）、tabs（标签页，子节点 `tab` 属性关联）、form-subtable（子表编辑器）、text/divider/image（静态展示）；未知节点静默跳过。
### 移动端适配

- 视口宽度 ≤768px 时，grid 布局自动按 `mobileColumns`（默认 1）切换为单列，避免字段在窄屏下被挤压。
- 触控操作：表单控件保留足够触控区域，保持可点击、可输入。
- 纵向堆叠：依赖 WForm/WFormItem 的移动端适配，表单项 label 与内容区在窄屏下自动上下排列。
- 横向滚动：子表区域使用 WTable，移动端单元格内容不换行，支持横向滚动浏览。
- 全屏切换：当动态表单嵌入 WDialog 使用时，弹窗在移动端自动全屏，点击全屏按钮可退出，退出后支持拖拽。

## 可访问性

- 每个表单项都有 label
- 必填项通过规则校验提示
