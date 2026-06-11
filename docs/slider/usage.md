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

## 可选范围

通过 `range-min` 和 `range-max` 限定可选范围。轨道会显示完整的 `min` ~ `max`，但 thumb 只能在可选范围内拖动，不可选区域以深灰色标识。

```vue
<w-slider v-model="value" :min="0" :max="100" :range-min="20" :range-max="80" show-min-max />
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
| rangeMin | - | number | - |
| rangeMax | - | number | - |
| showStops | - | boolean | - |
| showMinMax | - | boolean | - |
| disabled | 是否禁用 | boolean | - |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |

### Slots

| 插槽名 | 说明 |
|--------|------|
| max | 自定义内容 |
| min | 自定义内容 |
| tooltip | 文字提示插槽 |

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
