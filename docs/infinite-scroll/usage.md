# Infinite Scroll 无限滚动 - 使用说明

## 基础用法

```vue
<template>
  <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled">
    <li v-for="i in count" :key="i" class="list-item">{{ i }}</li>
  </ul>
  <p v-if="loading">加载中...</p>
  <p v-if="noMore">没有更多了</p>
</template>

<script setup>
import { ref, computed } from 'vue'
const count = ref(10)
const loading = ref(false)
const noMore = computed(() => count.value >= 20)
const disabled = computed(() => loading.value || noMore.value)
const load = () => {
  loading.value = true
  setTimeout(() => {
    count.value += 2
    loading.value = false
  }, 2000)
}
</script>

<style scoped>
.list { height: 300px; overflow: auto; padding: 0; margin: 0; list-style: none; }
.list-item { display: flex; align-items: center; justify-content: center; height: 50px; border-bottom: 1px solid #e8e8e8; }
</style>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| loading | 是否加载中 | boolean | - |
| noMore | - | boolean | - |
| distance | - | number | 0 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| load | 加载时触发 | (node, resolve) |

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
