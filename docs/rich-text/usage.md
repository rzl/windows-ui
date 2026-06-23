# WRichText 富文本编辑器

WRichText 是一个轻量级富文本编辑器组件，适用于需要简单格式化内容的场景。

## 基础用法

```vue
<template>
  <w-rich-text v-model="content" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue'
const content = ref('<p>Hello World</p>')
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | 绑定值（HTML 字符串） |
| placeholder | string | '请输入内容' | 占位提示 |
| disabled | boolean | false | 是否禁用 |
| size | string | - | 尺寸：large / default / small |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | string | 内容变化 |
| change | string | 内容变化 |

## 注意

- 当前版本仅支持加粗、斜体、下划线三种基础格式。
- 输出内容为 HTML 字符串，使用前请注意 XSS 防护。

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string |  |
| placeholder | 占位提示文本 | string | 请输入内容 |
| disabled | 是否禁用 | boolean | - |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |

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
