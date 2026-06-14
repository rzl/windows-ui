# WMonacoEditor 在线代码编辑器

WMonacoEditor 是一个在线 Monaco 代码编辑器组件，通过 iframe 加载 Monaco Editor CDN，适用于需要展示或编辑代码的表单场景。

## 基础用法

```vue
<template>
  <w-monaco-editor v-model="code" language="javascript" :height="300" />
</template>

<script setup>
import { ref } from 'vue'
const code = ref('function hello() {\n  console.log("Hello Monaco")\n}')
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | 绑定值（编辑器内容） |
| language | string | 'javascript' | 语言类型，如 javascript、typescript、sql、json、html、css 等 |
| height | number | 300 | 编辑器高度（px） |
| readOnly | boolean | false | 是否只读 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | string | 内容变化时同步 v-model |
| change | string | 内容变化时触发 |

## 注意

- 组件内部使用 iframe 加载 `public/monaco-editor.html`，该页面通过 CDN 引入 Monaco Editor。
- 编辑器与父页面通过 `postMessage` 进行双向通信，无需打包 Monaco 资源，避免构建体积膨胀。
- 首次加载需要联网获取 Monaco CDN 脚本，请确保运行环境可访问外网。
