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

## 路由激活与自动展开

`defaultActive` 支持传入菜单项的 `value`（如当前路由路径），组件会在菜单树中递归查找该项，自动高亮叶子菜单并逐级展开其所在分组（支持任意层级）。菜单项通常异步加载，组件会响应 `items` 与 `defaultActive` 的变化自动重新解析。

```vue
<template>
  <w-menu :items="items" :default-active="route.path" @select="handleSelect" />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

const items = ref([
  {
    label: '系统管理',
    value: '/system',
    children: [
      { label: '用户管理', value: '/system/user' },
      { label: '角色管理', value: '/system/role' }
    ]
  }
])

const handleSelect = (value) => router.push(value)
</script>
```

`defaultActive` 也支持数字（顶层索引）或索引链字符串（如 `'1-0'`）两种旧格式；传入未命中任何菜单项的值时保持无高亮。

## 收起模式

通过 `collapse` 属性将菜单切换为收起状态，仅显示图标，子菜单在悬停时从右侧弹出。支持多级级联弹出。

```vue
<w-menu collapse :items="items" />
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表 | array | [] |
| mode | 菜单模式 | string | vertical |
| defaultActive | 默认激活项，支持菜单 value（如路由路径，自动展开高亮）、顶层索引数字或索引链字符串 | string/number | - |
| collapse | 是否水平折叠 | boolean | - |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| select | 选中时触发 | (selection, row) |

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
