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
| size | 尺寸 | string | default（继承全局 size） |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

## 指令用法

除了组件形式，还提供 `v-permission` 指令，用于直接控制元素的显示/隐藏。

```vue
<template>
  <button v-permission="'user:delete'">删除</button>
  <button v-permission="['user:create', 'user:edit']">新增/编辑</button>
</template>

<script setup>
import { WPagination } from '@windows-ui/core'
// 全局权限校验函数在 app.use(WindowsUI, { permission: { has } }) 中配置
</script>
```

### 指令参数

| 参数 | 说明 | 类型 |
|------|------|------|
| v-permission | 权限码，支持单个字符串或字符串数组（任一通过即显示） | string / string[] |

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
