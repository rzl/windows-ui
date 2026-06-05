# Image 图片 - 使用说明

## 基础用法

```vue
<template>
  <w-image
    style="width: 100px; height: 100px"
    src="https://example.com/image.jpg"
    :preview-src-list="['https://example.com/image.jpg']"
  />
</template>

<script setup>
import { WImage } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| src | 图片地址 | string | - |
| alt | 替代文本 | string | - |
| width | 宽度 | string | - |
| height | 高度 | string | - |
| previewable | - | boolean | - |

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
