# Collapse 折叠面板 - 使用说明

## 基础用法

```vue
<template>
  <w-collapse v-model="activeNames">
    <w-collapse-item title="一致性 Consistency" name="1">
      <div>与现实生活一致：与现实生活的流程、逻辑保持一致。</div>
    </w-collapse-item>
    <w-collapse-item title="反馈 Feedback" name="2">
      <div>控制反馈：通过界面样式和交互动效让用户感知操作。</div>
    </w-collapse-item>
  </w-collapse>
</template>

<script setup>
import { ref } from 'vue'
import { WCollapse, WCollapseItem } from '@windows-ui/core'
const activeNames = ref(['1'])
</script>
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新时触发 | value |
| change | 用户确认选定的值时触发 | value |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| header | 作用域插槽，参数 `{ item, index }`，替换面板标题区 |
| action | 作用域插槽，参数 `{ item, index }`，面板标题右侧操作区 |

## 主题定制

可通过 CSS 变量自定义主题色：

```css
:root {
  --w-color-primary: #245edb;
  --w-bg-color: #ece9d8;
  --w-text-color-primary: #000;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```
