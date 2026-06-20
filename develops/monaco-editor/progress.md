# WMonacoEditor 开发进度

## 状态

已完成（基础版本）

## 实现清单

- [x] 封装 Monaco Editor iframe 组件
- [x] 支持 `v-model` 双向绑定
- [x] 支持 `language` 语言切换
- [x] 支持 `height` 高度配置
- [x] 支持 `readOnly` 只读模式
- [x] 创建 `public/monaco-editor.html` 宿主页面
- [x] 在 `windows-ui/src/index.ts` 注册并导出
- [x] 编写 playground 演示页面与路由
- [x] 编写 docs/designs/develops 三份文档

## 待优化项

- [ ] 支持 `theme` 主题切换（vs / vs-dark / hc-black）
- [ ] 支持 `options` 透传 Monaco 编辑器选项
- [ ] 支持 `width` 自适应或固定宽度
- [ ] 增加加载状态提示
- [ ] 支持 TypeScript 类型声明文件提示

## 变更记录

- 2026-06-13：初始实现，iframe + CDN 方案
- 2026-06-20：改为本地 `/monaco-editor/min` 资源默认加载，新增 `cdn` prop；修复 iframe 与父页面初始化时序；增加加载失败回退 textarea
