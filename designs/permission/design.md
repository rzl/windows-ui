# Permission 权限控制 - 设计文档

## 组件分类
Others

## 视觉设计

### 设计理念
无渲染组件，根据权限码控制内容的显示/隐藏。

### 设计原则
- 不引入额外 DOM 层级
- 使用条件渲染（v-if）
- 支持自定义权限检查函数
- 同时提供 `v-permission` 指令，支持组件与指令两种使用形态


### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动
## 交互设计
- 无权限: 不渲染任何内容
- 有权限: 正常渲染 slot 内容

## 可访问性
- 无权限内容不应出现在 DOM 中
- 不影响页面布局和焦点顺序
