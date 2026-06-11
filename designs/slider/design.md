# Slider 滑块 - 设计文档

## 组件分类
Form

## 视觉设计

### 设计理念
该组件采用 Windows XP 经典视觉风格，具有以下设计特征：
- 经典的蓝白配色方案
- 凸起/凹陷的 3D 边框效果
- 渐变标题栏
- Tahoma 字体家族

### 色彩规范
- 主色: #245edb (XP Blue)
- 成功色: #3a9e3a
- 警告色: #e4a010
- 危险色: #d92b2b
- 背景色: #ece9d8
- 边框色: #919b9c
- 滑块轨道背景: #c0c0c0
- 滑块 bar 渐变: 从 --w-xp-blue-light 到 --w-color-primary
- 滑块 thumb: 从 #fff 到 #ecebe5 到 #d6d0c5 的渐变
- 悬浮提示背景: #ffffe1（XP 经典黄色提示框）
- 悬浮提示边框: #000
- 不可选范围遮罩: #a0a0a0

### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动

## 交互设计
- 悬停状态: thumb 显示悬浮提示（tooltip），颜色加深/高亮
- 点击状态: 内阴影按压效果，thumb cursor 变为 grabbing
- 拖动状态: tooltip 保持显示，滑块值实时更新
- 禁用状态: 透明度 0.5
- 聚焦状态: 蓝色边框高亮
- 触摸支持: 支持触摸屏上的滑动操作
- 可选范围: 超出可选范围的区域显示深灰色遮罩，thumb 无法拖动到该区域

## 可访问性
- 支持键盘导航
- 颜色对比度符合 WCAG 2.0 AA 标准
- 支持屏幕阅读器
