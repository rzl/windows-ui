# Form 表单 - 使用说明

## 基础用法

```vue
<template>
  <w-form :model="form" :rules="rules" ref="formRef">
    <w-form-item label="用户名" prop="name">
      <w-input v-model="form.name" />
    </w-form-item>
    <w-form-item label="邮箱" prop="email">
      <w-input v-model="form.email" />
    </w-form-item>
    <w-form-item>
      <w-button type="primary" @click="submitForm">提交</w-button>
      <w-button @click="resetForm">重置</w-button>
    </w-form-item>
  </w-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { WForm, WFormItem, WInput, WButton } from '@windows-ui/core'
const formRef = ref()
const form = reactive({ name: '', email: '' })
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}
const submitForm = () => formRef.value.validate()
const resetForm = () => formRef.value.resetFields()
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model | - | object | - |
| rules | 验证规则 | object | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| submit | 提交时触发 | - |

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
