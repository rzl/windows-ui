# Carousel 轮播 - 使用说明

## 基础用法

```vue
<template>
  <w-carousel height="200px">
    <w-carousel-item v-for="item in 4" :key="item">
      <div class="carousel-item">{{ item }}</div>
    </w-carousel-item>
  </w-carousel>
</template>

<script setup>
import { WCarousel, WCarouselItem } from '@windows-ui/core'
</script>

<style scoped>
.carousel-item {
  height: 200px;
  background-color: #d3dce6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表 | array | [] |
| height | 高度 | - | 200px |
| autoplay | - | boolean | true |
| interval | - | number | 3000 |
| showIndicators | - | boolean | true |
| showArrows | - | boolean | true |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

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
