# Select 选择器 - 设计文档

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

### 尺寸规范
- 尺寸可选：small / default / large
- 默认高度：32px（default），跟随 CSS 变量 `--w-component-size`
- 小尺寸：24px（`--w-component-size-small`）
- 大尺寸：40px（`--w-component-size-large`）
- 组件内部图标（如有）随组件 size 联动

## 交互设计

### 基础展开
- 点击 trigger 区域展开下拉面板
- 再次点击 trigger 或右侧箭头图标收起
- 点击面板外部自动关闭

### 可搜索模式（filterable）
- 点击 trigger 后，trigger 区域切换为输入框并获得焦点
- 用户可直接输入关键字，下拉面板实时展示匹配选项
- 默认匹配规则：按选项 `label` 进行不区分大小写的包含匹配
- 可通过 `filter-method` 传入自定义匹配函数，满足按 value、拼音、关键词等场景
- 无匹配时面板显示"无匹配数据"
- 选中某选项后，trigger 恢复显示已选 label

### 清空
- 当 `clearable` 为 true 且已有选中值时，trigger 右侧显示关闭图标
- 点击关闭图标清空当前选中值并触发 `clear` 事件

### 禁用与聚焦
- 悬停状态: 颜色加深/高亮
- 点击状态: 内阴影按压效果
- 禁用状态: 透明度 0.5
- 聚焦状态: 蓝色边框高亮

## 可访问性
- 支持键盘导航
- 颜色对比度符合 WCAG 2.0 AA 标准
- 支持屏幕阅读器
