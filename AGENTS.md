# Windows UI — Agent 项目指南

> 本文档面向 AI 编程助手。如果你从未接触过本项目，请先阅读本文件再修改代码。

---

## 项目概览

**Windows UI** 是一个受 Windows XP 经典风格启发的 Vue 3 UI 组件库。

- **技术栈**：Vue 3（Composition API / `<script setup>`）、TypeScript、Vite、pnpm workspaces
- **组件数量**：82 个，覆盖基础、表单、数据展示、导航、反馈、其他六大类
- **包名**：`@windows-ui/core`（库）、`@windows-ui/playground`（示例站点）
- **默认前缀**：`w-`（例如 `w-button`），可通过 `ConfigProvider` 自定义
- **主题系统**：基于 CSS 变量（`--w-*`），易于覆盖主色、背景色、边框色等

---

## 仓库结构

```
windows-ui/
├── package.json                 # 根 package.json，定义 workspace 与顶层脚本
├── pnpm-workspace.yaml          # pnpm 工作区：packages/*
├── 1.text                       # 原始需求文档（只读参考）
│
├── packages/
│   ├── windows-ui/              # 📦 UI 库源码
│   │   ├── src/
│   │   │   ├── index.ts         # 统一入口：注册全部组件 + install 方法
│   │   │   ├── styles/
│   │   │   │   ├── variables.css    # CSS 变量（XP 配色、字体、阴影、尺寸等）
│   │   │   │   └── base.css         # XP 基础样式（按钮、输入框、窗口、滚动条等）
│   │   │   ├── utils/
│   │   │   │   ├── prefix.ts        # 组件前缀注入 / usePrefix()
│   │   │   │   └── types.ts         # 公共类型（ComponentSize、ConfigProviderContext）
│   │   │   └── components/
│   │   │       └── <name>/
│   │   │           └── <name>.vue   # 单文件组件（SFC）
│   │   ├── vite.config.ts       # Vite lib 模式构建配置（ES + UMD）
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── playground/              # 🎨 示例与文档站点
│       ├── src/
│       │   ├── main.ts          # 入口：createApp + use(WindowsUI) + router
│       │   ├── App.vue
│       │   ├── router/index.ts  # hash 路由，7 个页面
│       │   ├── views/Layout.vue # 侧边栏 + 内容区布局
│       │   ├── pages/           # 按分类展示组件（BasicPage、FormPage…）
│       │   └── components/
│       │       ├── DemoSection.vue   # 组件演示区块（标题 + 描述）
│       │       └── DemoBlock.vue     # 单个示例卡片（标题 + slot）
│       ├── index.html
│       ├── vite.config.ts       # 开发别名指向库源码，便于热更新
│       └── package.json
│
├── docs/                        # 每个组件的使用说明文档
│   └── <component>/usage.md
├── designs/                     # 每个组件的设计文档（视觉、交互、可访问性）
│   └── <component>/design.md
└── develops/                    # 每个组件的开发进度跟踪
    └── <component>/progress.md
```

---

## 构建与运行命令

> 根目录使用 `pnpm`（非 npm / yarn）。若尚未安装依赖，请先执行 `pnpm install`。

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动 playground 开发服务器（等价于 `pnpm -C packages/playground dev`） |
| `pnpm build` | 构建 UI 库（ES + UMD + d.ts），输出到 `packages/windows-ui/dist/` |
| `pnpm build:playground` | 构建 playground 生产包 |

### 库构建细节

- **入口**：`packages/windows-ui/src/index.ts`
- **产物**：
  - `dist/windows-ui.es.js`（ES Module）
  - `dist/windows-ui.umd.js`（UMD）
  - `dist/windows-ui.css`（合并后的样式）
  - `dist/index.d.ts`（类型声明）
- **外部依赖**：`vue`（不会打包进库）
- **CSS 处理**：`cssCodeSplit: false`，所有样式合并为单个 CSS 文件

### playground 开发细节

- `vite.config.ts` 中通过 alias 将 `@windows-ui/core` 指向 `../windows-ui/src/index.ts`，开发时修改库源码可直接热更新，无需先构建库。

---

## 组件开发约定

### 文件与命名

1. **目录**：每个组件独占一个目录，`packages/windows-ui/src/components/<kebab-case-name>/`
2. **文件**：目录内只有一个 `<kebab-case-name>.vue`，例如 `button/button.vue`。
3. **组件名**：Vue 组件内部必须使用 `defineOptions({ name: 'W<Name>' })`，例如 `WButton`。
4. **注册前缀**：在 `index.ts` 中统一注册为 `w-<name>`，通过 `usePrefix()` 可支持自定义前缀。

### 单文件组件（SFC）规范

- 使用 `<script setup lang="ts">` + `defineProps` + `defineEmits`。
- Props 采用对象语法声明，便于设置默认值：

  ```ts
  defineProps({
    type: { type: String, default: 'default' },
    size: { type: String, default: 'default' },
    disabled: Boolean
  })
  ```

- 样式使用 `<style scoped>`，类名遵循简化 BEM：
  - 基础块：`.w-button`
  - 修饰符：`.w-button--primary`、`.w-button--small`
  - 状态：`.is-plain`、`.is-disabled`、`.is-round`
  - 子元素：`.w-input__prefix`、`.w-input__suffix`

### CSS 变量

所有主题色、字体、尺寸必须引用 `variables.css` 中的变量，禁止写死硬编码颜色（XP 风格除外，需保持视觉一致性）。常用变量：

- `--w-color-primary` / `--w-color-success` / `--w-color-warning` / `--w-color-danger`
- `--w-bg-color`（`#ece9d8`，经典 XP 米色背景）
- `--w-font-family`（`Tahoma, Microsoft Sans Serif, sans-serif`）
- `--w-border-radius-base`（`3px`）
- `--w-component-size` / `--w-component-size-large` / `--w-component-size-small`

### 公共工具

- **前缀**：`src/utils/prefix.ts` 提供 `usePrefix()`，通过 Vue `provide/inject` 与 `WConfigProvider` 配合实现动态前缀。
- **类型**：`src/utils/types.ts` 定义 `ComponentSize = 'large' | 'default' | 'small'`。

---

## 文档与进度跟踪

每新增或修改一个组件，**必须**同步更新以下三份文档（全部使用中文）：

| 目录 | 文件 | 内容要求 |
|------|------|----------|
| `docs/<component>/` | `usage.md` | 基础用法示例、Props / Events / Slots 表格、主题定制说明 |
| `designs/<component>/` | `design.md` | 组件分类、视觉设计（色彩、尺寸、圆角）、交互设计、可访问性 |
| `develops/<component>/` | `progress.md` | 状态（已完成/进行中）、实现清单、待优化项、变更记录 |

> 当前项目尚未配置自动化文档生成工具，文档为纯 Markdown 手工维护。

---

## 测试策略

**现状**：本项目目前没有配置任何测试框架（无 Jest、Vitest、Cypress、Playwright），也没有测试文件。

**建议**：
- 如需补充测试，推荐在 `packages/windows-ui` 中引入 **Vitest** + `@vue/test-utils`，与现有 Vite 工具链保持一致。
- 组件以单元测试为主：验证 Props 渲染、事件触发、CSS 类名切换。
- 复杂交互组件（如 `date-picker`、`table`、`virtualized-*`）建议补充集成测试。

---

## 代码风格

- **缩进**：2 个空格
- **分号**：可选，但现有代码中 TS/JS 语句末尾通常省略分号
- **引号**：单引号
- **语言**：注释与文档以 **中文** 为主；代码中的字符串常量若为 UI 展示文本，也用中文
- **无 linter**：当前未安装 ESLint / Prettier，提交前请人工保持风格一致

---

## 新增组件流程

1. 在 `packages/windows-ui/src/components/` 下新建目录与 `.vue` 文件。
2. 实现组件，确保包含 `defineOptions({ name: 'W<Name>' })`。
3. 在 `packages/windows-ui/src/index.ts` 中：
   - `import W<Name> from './components/<name>/<name>.vue'`
   - 加入 `components` 数组
   - 加入 named export
4. 在 playground 的对应分类页面（如 `BasicPage.vue`、`FormPage.vue` 等）添加 `demo-section` / `demo-block` 示例。
5. 编写 `docs/<name>/usage.md`、`designs/<name>/design.md`、`develops/<name>/progress.md`。
6. 运行 `pnpm dev` 验证 playground 效果，运行 `pnpm build` 验证库构建无报错。

---

## 安全与注意事项

- **SVG 图标**：`WIcon` 组件内部使用 `v-html` 渲染内联 SVG，目前图标为项目内置常量，若未来支持外部传入 SVG 字符串，需防范 XSS（对用户输入做净化）。
- **样式隔离**：各组件使用 `scoped`，但全局主题变量和 `base.css` 中的工具类（如 `.w-xp-theme`、`.w-xp-btn-base`）会全局生效。
- **peerDependency**：库仅将 `vue` 标记为 `peerDependency`，发布时务必确保版本兼容 `^3.4.0`。

---

## 快速参考

| 问题 | 答案 |
|------|------|
| 用什么包管理器？ | pnpm |
| 怎么启动开发？ | `pnpm dev` |
| 怎么构建组件库？ | `pnpm build` |
| 组件文件放哪？ | `packages/windows-ui/src/components/<name>/<name>.vue` |
| 怎么导出组件？ | 在 `packages/windows-ui/src/index.ts` import + 加入数组 + named export |
| 怎么写文档？ | 在 `docs/`、`designs/`、`develops/` 下各建 `<name>/<file>.md` |
| 主题怎么改？ | 覆盖 `:root` 中的 `--w-*` CSS 变量，或通过 `ConfigProvider` 传前缀 |
| 有测试吗？ | 目前没有；建议引入 Vitest |
