# Permission 权限控制 - 使用说明

## 基础用法

```vue
<template>
  <w-permission code="user:delete" :has="checkPermission">
    <w-button type="danger">删除</w-button>
  </w-permission>
</template>

<script setup>
const checkPermission = (code) => {
  // 根据当前用户权限判断
  return ['user:list', 'user:delete'].includes(code)
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| code | 是否代码样式 | string |  |
| has | - | function | null |

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
