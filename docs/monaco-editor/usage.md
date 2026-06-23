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
| cdn | string | '' | Monaco 资源根路径，默认使用本地 `/monaco-editor/min`，可配置为 CDN 地址 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | string | 内容变化时同步 v-model |
| change | string | 内容变化时触发 |

## 注意

- 组件内部使用 iframe 加载 `public/monaco-editor.html`，该页面通过 `<script>` 动态引入 Monaco Editor 资源。
- 编辑器与父页面通过 `postMessage` 进行双向通信。
- 默认使用本地 `public/monaco-editor/min` 资源，构建后会随产物一起部署，无需依赖外网 CDN。
- 可通过 `cdn` prop 指定其他资源根路径，如内网 CDN 或公共 CDN。
- 当 Monaco 资源加载失败时，组件会自动回退到多行文本框，保证内容仍可编辑。

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string |  |
| language | - | string | javascript |
| height | 高度 | number | 300 |
| readOnly | - | boolean | false |
| cdn | - | string |  |

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
