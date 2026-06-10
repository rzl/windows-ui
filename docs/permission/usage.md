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
| code | 权限码 | string | '' |
| has | 权限检查函数 | (code: string) => boolean | null |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 有权限时显示的内容 |

## 注意事项
- 当 `code` 为空时，默认显示内容
- 当 `has` 未传入时，默认显示内容（实际项目中应通过全局注入权限函数）
