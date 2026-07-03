# WPageRenderer 页面渲染器

低代码自定义页面渲染器，根据页面配置递归渲染组件，支持数据源加载、事件执行、弹窗嵌入与权限控制。

## 基础用法

```vue
<script setup lang="ts">
import { WPageRenderer } from '@windows-ui/core'
import * as pageApi from '@/api/page'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

async function loadPage(code: string) {
  return pageApi.getPage(code)
}

async function executeDataSource(code: string, ds: any, ctx?: any) {
  return pageApi.executePageDataSource(code, ds, ctx)
}

function hasPermission(permission: string) {
  return authStore.hasPermission(permission)
}

function handleNavigate(target: string) {
  router.push(target)
}
</script>

<template>
  <w-page-renderer
    code="sales_dashboard"
    :load-page="loadPage"
    :execute-data-source="executeDataSource"
    :has-permission="hasPermission"
    @navigate="handleNavigate"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | `string` | — | 页面编码 |
| config | `PageConfig` | — | 直接传入配置进行渲染，优先级高于 `code` |
| preview | `boolean` | `false` | 预览模式，跳过权限校验 |
| loadPage | `(code: string) => Promise<any>` | — | 加载页面数据回调 |
| executeDataSource | `(code: string, ds: PageDataSource, ctx?: any) => Promise<any>` | — | 执行数据源回调 |
| hasPermission | `(code: string) => boolean` | — | 权限判断回调 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| navigate | `target: string` | 页面跳转事件 |
| openExternal | `target: string` | 打开外部链接事件 |
| openDialog | `{ target, title }` | 打开弹窗事件 |
| callApi | `{ target, method, params, body }` | 调用接口事件 |
| refresh | — | 刷新事件 |
| back | — | 返回事件 |

## 数据源类型

渲染器支持以下数据源类型：

- `static`：静态值
- `sql`：SQL 查询（由后端执行）
- `api`：内部接口请求
- `script`：执行脚本（由后端执行）

## 事件动作

组件可配置以下事件动作：

- `navigate`：跳转页面
- `openExternal`：打开外部链接
- `openDialog`：打开弹窗
- `callApi`：调用接口
- `setVariable`：设置页面变量
- `refresh`：刷新页面
- `goBack`：返回上一页

## 权限

非预览模式下，渲染器会根据页面 `permission` 字段调用 `hasPermission`；无权限时展示 `w-result` 提示。
