# Upload 上传 - 使用说明

## 基础用法

```vue
<template>
  <w-upload action="https://example.com/upload" @success="handleSuccess">
    <w-button type="primary">点击上传</w-button>
  </w-upload>
</template>

<script setup>
import { WUpload, WButton } from '@windows-ui/core'
const handleSuccess = (res) => console.log(res.url)
</script>
```

## 自定义上传函数

适用于需要自定义上传逻辑（如携带 token、使用 axios）的场景。

```vue
<template>
  <w-upload :http-request="customUpload" v-model="fileUrl" />
</template>

<script setup>
import { ref } from 'vue'
const fileUrl = ref('')

async function customUpload(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/common/upload', {
    method: 'POST',
    body: formData
  }).then(r => r.json())
  return res.data // { url, name, size }
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| accept | 可接受的文件类型 | string | - |
| multiple | 是否多选 | boolean | false |
| buttonText | 按钮文字 | string | 选择文件 |
| size | 尺寸 | string | default（继承全局 size） |
| action | 上传地址（与 httpRequest 二选一） | string | - |
| headers | 上传请求头 | object | {} |
| httpRequest | 自定义上传函数 | (file) => Promise<{url,name,size}> | - |
| modelValue / v-model | 已上传文件的 URL | string / string[] | '' |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 值改变时触发 | value |
| update:modelValue | v-model 更新 | value |
| success | 单个文件上传成功 | { url, name, size } |
| error | 单个文件上传失败 | error |
| remove | 移除文件 | index |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认触发按钮内容 |

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
