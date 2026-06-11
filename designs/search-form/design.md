# SearchForm 查询表单 - 设计文档

## 组件分类
Form

## 视觉设计

### 设计理念
基于 WForm 封装的查询区域，采用 XP 风格边框，支持展开/收起。

### 色彩规范
- 背景: #ece9d8
- 边框: 凸起效果（#fff #808080 #808080 #fff）
- 内边距: 12px

### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动

## 交互设计
- 查询按钮: 触发 search 事件
- 重置按钮: 清空所有字段，触发 reset 事件
- 展开/收起: 切换字段区域高度

## 可访问性
- 表单字段支持 label
- 按钮有明确的文字描述
