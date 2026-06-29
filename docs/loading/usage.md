# Loading 加载 - 使用说明

## 基础用法

```vue
<template>
  <w-button @click="handleClick">显示加载中</w-button>
  <div v-loading="loading" style="height: 100px; margin-top: 20px;">
    加载区域
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { WButton } from '@windows-ui/core'
const loading = ref(false)
const handleClick = () => {
  loading.value = true
  setTimeout(() => loading.value = false, 2000)
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| visible | 是否可见 | boolean | - |
| text | 文本内容 | string | - |

### 指令绑定值

| 绑定值 | 说明 | 类型 |
|--------|------|------|
| v-loading | 是否显示加载遮罩，可传布尔值、提示文本字符串或 `{ visible, text }` 对象 | boolean / string / object |

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
