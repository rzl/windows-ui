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
| trigger | 触发时机：`'blur'` / `'change'`，不传则两种时机都触发 | `{ required: true, trigger: 'blur', message: '不能为空' }` |
| validator | 自定义验证函数，支持同步返回或返回 Promise | `{ validator: (val) => val > 0 \|\| '必须大于0' }` |
| asyncValidator | 异步验证函数，返回 Promise<string \| undefined> | `{ asyncValidator: async (val) => { const ok = await checkName(val); if (!ok) return '名称已存在' } }` |

## 校验触发时机

- **change 触发**：`w-form-item` 会自动监听 `model` 中对应字段的变化，值一变立即校验（适用于所有写入 model 的输入组件，无需逐个接入）。**`model` 需要是 `reactive` 对象**（普通对象没有响应性，无法触发 change 校验）。
- **blur 触发**：`w-input` 已内置支持，失焦时触发校验；其他输入组件可通过 inject `wFormItemContext` 后调用 `triggerValidate('blur')` 接入。
- 提交时 `validate()` 仍会校验全部字段（忽略 trigger 过滤）。
- 校验失败的默认文案已接入 i18n，可通过语言包自定义（键：`字段不能为空` / `字段格式不正确` / `字段最少字符` / `字段最多字符` / `字段验证失败`）。

## 表单方法

| 方法名 | 说明 |
|--------|------|
| validate(fields?) | 验证全部字段（或指定 prop 数组），返回 Promise<boolean> |
| validateField(prop, trigger?) | 验证单个字段，返回 Promise<boolean> |
| resetFields() | 重置为表单挂载时的初始值并清除错误（不会再把字段清成 undefined） |
| clearValidate(fields?) | 清除验证错误，可传 prop 数组只清除指定字段 |

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model | 表单数据（需为 reactive 对象） | object | - |
| rules | 验证规则 | object | - |
| size | 尺寸 | string | default（继承全局 size） |
| labelWidth | 标签宽度 | - | 100px |

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
| validateField | 组件暴露的方法 |
| resetFields | 组件暴露的方法 |
| clearValidate | 组件暴露的方法 |

## 样式说明

表单容器默认只有顶部与左侧 2px 白色凸起边，**没有右边框和底边框**，适合直接嵌入 `w-dialog`、页签等容器中。如需完整边框，可覆盖样式（凸起 3D 边使用主题变量，暗色模式自动适配）：

```css
.w-form {
  border: 2px solid;
  border-color: var(--w-xp-bevel-light) var(--w-xp-bevel-dark) var(--w-xp-bevel-dark) var(--w-xp-bevel-light);
}
```

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
