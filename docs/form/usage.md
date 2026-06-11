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
  name: [{ required: true, message: '请输入用户名' }],
  email: [{ required: true, message: '请输入邮箱' }, { pattern: /^\S+@\S+\.\S+$/, message: '邮箱格式不正确' }]
}
const submitForm = () => formRef.value.validate().then(valid => { if (valid) alert('提交成功') })
const resetForm = () => formRef.value.resetFields()
</script>
```

## 验证规则

| 规则名 | 说明 | 示例 |
|--------|------|------|
| required | 必填 | `{ required: true, message: '不能为空' }` |
| pattern | 正则验证 | `{ pattern: /^\d+$/, message: '必须为数字' }` |
| min | 最小长度 | `{ min: 2, message: '至少2个字符' }` |
| max | 最大长度 | `{ max: 20, message: '最多20个字符' }` |
| validator | 自定义验证函数 | `{ validator: (val) => val > 0 || '必须大于0' }` |

## 表单方法

| 方法名 | 说明 |
|--------|------|
| validate() | 验证全部字段，返回 Promise<boolean> |
| resetFields() | 重置表单数据和错误 |
| clearValidate() | 清除验证错误 |

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model | - | object | - |
| rules | 验证规则 | object | - |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| submit | 提交时触发 | - |
| validate | 验证时触发 | (valid, fields) |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

### Methods

| 方法名 | 说明 |
|--------|------|
| validate | 组件暴露的方法 |
| resetFields | 组件暴露的方法 |
| clearValidate | 组件暴露的方法 |

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
