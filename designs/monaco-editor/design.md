# WMonacoEditor 在线代码编辑器设计

## 组件分类

表单组件（Form）

## 视觉设计

- 容器：宽度占满父元素，高度由 `height` 属性决定
- 边框：与输入框一致的 XP 凹陷风格边框
- 内部 iframe：无边框、无滚动条，占满整个容器
- 编辑器内部使用 Monaco 默认主题（vs），保持代码高亮清晰可读

## 交互设计

- 组件挂载后自动加载 iframe，iframe 内 Monaco 初始化完成后向父页面发送 `ready` 消息
- 父页面通过 `postMessage` 向 iframe 发送初始化参数、内容更新、语言切换等指令
- 用户在编辑器内输入时，iframe 通过 `postMessage` 回传 `change` 事件，父页面同步 `v-model`
- 支持 `readOnly` 只读模式，禁止编辑

## 可访问性

- iframe 通过 `title` 属性可配置（后续优化）
- 编辑器内部焦点状态由 Monaco Editor 自身管理
