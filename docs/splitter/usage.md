# Splitter 分割面板 - 使用说明

## 基础用法

### 左右分隔

```vue
<template>
  <w-splitter :split="40" style="height: 200px">
    <template #first>左侧面板</template>
    <template #second>右侧面板</template>
  </w-splitter>
</template>
```

### 上下分隔

```vue
<template>
  <w-splitter direction="vertical" :split="30" style="height: 200px">
    <template #first>上面板</template>
    <template #second>下面板</template>
  </w-splitter>
</template>
```

### 组合分隔

```vue
<template>
  <w-splitter direction="vertical" :split="50" style="height: 300px">
    <template #first>
      <w-splitter :split="50" style="height: 100%">
        <template #first>左上</template>
        <template #second>右上</template>
      </w-splitter>
    </template>
    <template #second>
      <w-splitter :split="50" style="height: 100%">
        <template #first>左下</template>
        <template #second>右下</template>
      </w-splitter>
    </template>
  </w-splitter>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| split | 第一个面板所占百分比 | number | 50 |
| direction | 分隔方向，`horizontal` 为左右，`vertical` 为上下 | string | horizontal |

### Slots

| 插槽名 | 说明 |
|--------|------|
| first | 第一个面板内容（左/上） |
| second | 第二个面板内容（右/下） |

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
