# Menu 菜单 - 使用说明

## 基础用法

```vue
<template>
  <w-menu :items="items" />
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { label: '首页', icon: 'home' },
  { label: '产品', icon: 'folder', children: [{ label: '产品A' }, { label: '产品B' }] },
  { label: '关于', icon: 'user' }
])
</script>
```

## 多级菜单

`items` 支持无限层级嵌套，通过 `children` 字段配置子菜单。

```vue
<template>
  <w-menu :items="items" />
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { label: '首页', icon: 'home' },
  {
    label: '产品中心',
    icon: 'folder',
    children: [
      { label: '产品A' },
      {
        label: '产品B',
        children: [
          { label: 'B-基础版' },
          {
            label: 'B-专业版',
            children: [
              { label: '专业版-详情1' },
              { label: '专业版-详情2' }
            ]
          }
        ]
      }
    ]
  }
])
</script>
```

## 水平菜单

```vue
<w-menu mode="horizontal" :items="items" />
```

## 收起模式

通过 `collapse` 属性将菜单切换为收起状态，仅显示图标，子菜单在悬停时从右侧弹出。支持多级级联弹出。

```vue
<w-menu collapse :items="items" />
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表（支持多级 children） | array | [] |
| mode | 菜单模式 | string | vertical |
| defaultActive | 默认激活项 | string / number | - |
| collapse | 是否收起（仅垂直模式有效） | boolean | false |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| select | 选中时触发 | (value) |

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
