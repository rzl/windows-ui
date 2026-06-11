# Upload 上传 - 使用说明

## 基础用法

```vue
<template>
  <w-upload action="https://example.com/upload" :on-success="handleSuccess">
    <w-button type="primary">点击上传</w-button>
  </w-upload>
</template>

<script setup>
import { WUpload, WButton } from '@windows-ui/core'
const handleSuccess = (res, file) => console.log(file.name + ' 上传成功')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| accept | - | string | - |
| multiple | 是否多选 | boolean | - |
| buttonText | - | string | 选择文件 |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 值改变时触发 | value |
| remove | - | - |

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
