# 阶段十五：顶部系统设置与国际化

## 目标

在低代码平台页面顶部提供统一的系统设置入口，以抽屉弹窗形式支持主题色、系统语言、组件尺寸等个性化配置；并建立平台级多语言体系，与组件库多语言保持一致的实现风格。

## 功能清单

- **顶部配置按钮**：在用户头像左侧新增设置图标按钮。
- **抽屉式设置面板**：点击按钮后从右侧弹出 `w-drawer`，包含系统语言、组件尺寸、主色、成功色、警告色、危险色配置项。
- **即时生效与持久化**：保存后同步更新 `appStore`，主题与尺寸通过 `w-config-provider` 即时生效；所有设置写入 `localStorage`，刷新自动恢复。
- **VConsole 调试开关**：新增「启用 VConsole」选项，开启后从 CDN 动态加载 VConsole，关闭后销毁。
- **平台级多语言**：
  - 新增 `packages/lowcode-admin/src/locale/` 模块。
  - 语言包为单层键值对，中文作为键，参考组件库 `packages/windows-ui/src/locale` 实现。
  - 提供 `useLowcodeLocale()` 与 `createLowcodeI18n()`。
  - 语言切换同时同步组件库 `WConfigProvider` 的 `locale`。

## 新增文件

| 文件 | 说明 |
|------|------|
| `packages/lowcode-admin/src/locale/lang/zh-CN.ts` | 中文语言包 |
| `packages/lowcode-admin/src/locale/lang/en-US.ts` | 英文语言包 |
| `packages/lowcode-admin/src/locale/index.ts` | 多语言 API：注册、切换、useLowcodeLocale、createLowcodeI18n |
| `packages/lowcode-admin/src/utils/vconsole.ts` | VConsole CDN 动态加载与销毁 |

## 修改文件

| 文件 | 说明 |
|------|------|
| `packages/lowcode-admin/src/views/layout/LowcodeLayout.vue` | 顶部新增设置按钮与抽屉面板 |
| `packages/lowcode-admin/src/stores/app.ts` | 新增 `locale`、`vconsoleEnabled`，设置持久化到 `localStorage` |
| `packages/lowcode-admin/src/App.vue` | `w-config-provider` 增加 `locale` 绑定；根据 `vconsoleEnabled` 加载/销毁 VConsole |
| `packages/lowcode-admin/src/main.ts` | 注册 `createLowcodeI18n` |
| `sop/manuals/getting-started/homepage.md` | 补充系统设置操作说明 |
| `sop/architecture/frontend.md` | 补充主题与多语言架构说明 |

## 任务清单

- [x] 顶部新增设置按钮
- [x] 抽屉式系统设置面板
- [x] 主题色（主色/成功色/警告色/危险色）配置
- [x] 系统语言切换
- [x] 组件尺寸切换
- [x] 设置持久化到 `localStorage`
- [x] VConsole 调试开关（CDN 动态加载）
- [x] 平台级多语言模块
- [x] 多语言采用单层键值对、中文作键
- [x] 同步更新用户手册与架构文档
- [x] 验证 `pnpm build:lowcode` 通过

## 验收标准

1. [x] 顶部用户头像左侧出现设置按钮。
2. [x] 点击设置按钮弹出抽屉，可配置语言、尺寸、主题色。
3. [x] 保存设置后主题色、组件尺寸、语言即时生效。
4. [x] 刷新页面后设置自动恢复。
5. [x] 平台自有文本（如设置面板标题）切换语言时自动更新。
6. [x] 组件库内置文本（如分页、表单提示）同步切换语言。
7. [x] 开启 VConsole 后页面从 CDN 加载调试面板，关闭后销毁。
8. [x] `pnpm build:lowcode` 无类型错误，构建成功。

## 运行记录

- 2026-06-19：实现顶部设置按钮与抽屉面板。
- 2026-06-19：实现 `locale` 模块与 `appStore` 持久化。
- 2026-06-19：新增 VConsole 调试开关，通过 CDN 动态加载。
- 2026-06-19：同步更新用户手册、前端架构文档、阶段进度文档。
- 2026-06-19：运行 `pnpm build:lowcode` 验证通过。
