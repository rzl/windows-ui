# WPageRenderer 开发进度

## 状态

已完成

## 实现清单

- [x] 迁移页面渲染器到组件库
- [x] 递归渲染页面组件树
- [x] 支持静态/SQL/API/脚本数据源
- [x] 支持事件动作与页面变量
- [x] 支持弹窗嵌入与权限校验
- [x] 通过 props 抽象 `loadPage` / `executeDataSource` / `hasPermission`
- [x] 文档与示例

## 待优化项

- 数据源加载增加 Loading 状态与错误提示。
- `callApi` 动作默认实现可考虑提供通用请求封装。
- 支持页面级生命周期钩子。

## 变更记录

- 2026-07-03：从 `packages/lowcode-admin` 提取到 `packages/windows-ui`。
