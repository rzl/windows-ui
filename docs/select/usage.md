# Select 选择器 - 使用说明

## 基础用法

```vue
<template>
  <w-select v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
import { WSelect } from '@windows-ui/core'

const value = ref('')
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' }
]
</script>
```

## 可搜索

设置 `filterable` 后，点击选择器 trigger 会进入输入状态，可直接输入关键字过滤选项。

```vue
<template>
  <w-select v-model="value" :options="options" filterable placeholder="请选择或输入" />
</template>

<script setup>
import { ref } from 'vue'
import { WSelect } from '@windows-ui/core'

const value = ref('')
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' }
]
</script>
```

## 自定义过滤函数

可通过 `filter-method` 自定义匹配规则。函数接收当前选项和输入字符串，返回布尔值表示是否匹配。

```vue
<template>
  <w-select v-model="value" :options="options" filterable :filter-method="filterByValue" />
</template>

<script setup>
import { ref } from 'vue'
import { WSelect } from '@windows-ui/core'

const value = ref('')
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' }
]

const filterByValue = (option, query) => {
  return String(option.value).toLowerCase().includes(query.toLowerCase())
}
</script>
```

## 多选

设置 `multiple` 后，选择器支持多选，绑定值为数组。

```vue
<template>
  <w-select v-model="value" :options="options" multiple placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
import { WSelect } from '@windows-ui/core'

const value = ref([])
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' }
]
</script>
```

## 远程搜索

设置 `remote` 并传入 `remoteMethod`，可在输入时远程获取选项。

```vue
<template>
  <w-select
    v-model="value"
    :options="options"
    filterable
    remote
    :remote-method="fetchOptions"
    :loading="loading"
    placeholder="请输入关键字"
  />
</template>

<script setup>
import { ref } from 'vue'
import { WSelect } from '@windows-ui/core'

const value = ref('')
const options = ref([])
const loading = ref(false)

const fetchOptions = async (query) => {
  loading.value = true
  const res = await fetch(`/api/search?q=${query}`)
  options.value = await res.json()
  loading.value = false
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string/number/array | - |
| options | 选项数据 | array | [] |
| placeholder | 占位提示文本 | string | 请选择 |
| clearable | 是否可清空 | boolean | true |
| filterable | 是否可搜索 | boolean | false |
| filterMethod | 过滤方法 | function | null |
| remote | 是否远程搜索 | boolean | false |
| remoteMethod | 远程搜索方法 | function | null |
| loading | 是否加载中 | boolean | false |
| multiple | 是否多选 | boolean | false |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |
| clear | 清空时触发 | - |

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
