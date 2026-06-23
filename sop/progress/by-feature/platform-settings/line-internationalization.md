# 子线：平台国际化

## 来源阶段

[phase-15：顶部系统设置与国际化](../../by-phase/phase-15.md)

## 目标

建立平台级多语言体系，与组件库多语言风格保持一致。

## 关键实现

- `packages/lowcode-admin/src/locale/` 模块
- 单层键值对语言包，中文作为键
- `useLowcodeLocale()` 与 `createLowcodeI18n()`
- 语言切换同步 `WConfigProvider`

## 验收标准

- [x] 平台自有文本切换语言时自动更新
- [x] 组件库内置文本同步切换语言
