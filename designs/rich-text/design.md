# WRichText 富文本编辑器设计

## 组件分类

表单组件（Form）

## 视觉设计

- 容器：白色背景，深/浅色边框模拟 XP 凹陷效果
- 工具栏：浅米色背景，底部边框分隔
- 编辑区：最小高度 120px，支持 placeholder
- 尺寸：支持 small / default / large 三种尺寸


### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动
## 交互设计

- 点击工具栏按钮对选区应用格式（加粗/斜体/下划线）
- 编辑区 contenteditable，实时输入同步 v-model
- 清空按钮可清空内容

## 可访问性

- 工具栏按钮使用按钮元素，支持键盘聚焦
- 编辑区可通过 Tab 进入
