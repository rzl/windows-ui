# Input OTP 一次性密码 - 使用说明

## 基础用法

```vue
<template>
  <w-input-otp v-model="otp" :length="6" />
</template>

<script setup>
import { ref } from 'vue'
import { WInputOtp } from '@windows-ui/core'
const otp = ref('')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string | - |
| length | 长度 | number | 6 |
| clearable | 是否可清空 | boolean | true |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| complete | - | - |
| clear | 清空时触发 | - |

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
