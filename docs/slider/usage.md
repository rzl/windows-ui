# Slider 滑块 - 使用说明

## 基础用法

```vue
<template>
  <w-slider v-model="value" />
</template>

<script setup>
import { ref } from 'vue'
import { WSlider } from '@windows-ui/core'
const value = ref(50)
</script>
```

## 显示断点

通过 `step` 和 `show-stops` 显示断点。

```vue
<w-slider v-model="value" :step="10" show-stops />
```

## 显示上下限

通过 `show-min-max` 在滑块下方显示最小值和最大值。

```vue
<w-slider v-model="value" show-min-max />
```

## 自定义悬浮提示

通过 `tooltip` 插槽自定义 thumb 上悬浮显示的内容。

```vue
<w-slider v-model="value">
  <template #tooltip="{ value }">
    {{ value }}%
  </template>
</w-slider>
```

## 自定义上下限内容

通过 `min` 和 `max` 插槽自定义上下限的显示内容。

```vue
<w-slider v-model="value" show-min-max>
  <template #min="{ value }">最小: {{ value }}</template>
  <template #max="{ value }">最大: {{ value }}</template>
</w-slider>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | number | 0 |
| min | 最小值 | number | 0 |
| max | 最大值 | number | 100 |
| step | 步长 | number | 1 |
| showStops | 是否显示断点 | boolean | false |
| showMinMax | 是否显示上下限 | boolean | false |
| disabled | 是否禁用 | boolean | false |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新时触发 | value |
| change | 用户确认选定的值时触发 | value |

### Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|------------|
| tooltip | 自定义 thumb 悬浮提示内容 | { value } |
| min | 自定义下限显示内容（需开启 show-min-max） | { value } |
| max | 自定义上限显示内容（需开启 show-min-max） | { value } |

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
