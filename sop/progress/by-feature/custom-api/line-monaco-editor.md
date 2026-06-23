# 子线：Monaco 编辑器集成

## 来源阶段

[phase-18：在线 Monaco 接口编辑器](../../by-phase/phase-18.md)

## 目标

为自定义接口提供在线代码编辑体验。

## 关键实现

- 安装 `monaco-editor`
- `public/monaco-editor.html` iframe 页面
- `postinstall` 脚本复制 Monaco 资源
- 复用 `WMonacoEditor` 组件

## 验收标准

- [x] 编辑页可编写 JavaScript 脚本
- [x] 支持语法高亮与代码提示
