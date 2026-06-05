<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="悬浮内容面板，比 Tooltip 更丰富" id="popover" doc="popover">

      <demo-block title="基础弹出框" code="&lt;w-popover title=&quot;用户信息&quot; content=&quot;这是用户详细信息面板&quot;&gt;&lt;w-button&gt;查看用户&lt;/w-button&gt;&lt;/w-popover&gt;"><w-popover title="用户信息" content="这是用户详细信息面板"><w-button>查看用户</w-button></w-popover></demo-block>
      <demo-block title="hover 触发" code="&lt;w-popover title=&quot;快捷操作&quot; content=&quot;鼠标悬停触发&quot; trigger=&quot;hover&quot;&gt;&lt;w-button&gt;hover 触发&lt;/w-button&gt;&lt;/w-popover&gt;"><w-popover title="快捷操作" content="鼠标悬停触发" trigger="hover"><w-button>hover 触发</w-button></w-popover></demo-block>
      <demo-block title="自定义宽度" code="&lt;w-popover title=&quot;宽面板&quot; content=&quot;这是一个比较宽的内容面板&quot; :width=&quot;300&quot;&gt;&lt;w-button&gt;宽面板&lt;/w-button&gt;&lt;/w-popover&gt;"><w-popover title="宽面板" content="这是一个比较宽的内容面板" :width="300"><w-button>宽面板</w-button></w-popover></demo-block>
      <demo-block title="嵌套内容" code="&lt;w-popover title=&quot;操作菜单&quot;&gt;&lt;template #content&gt;&lt;w-space direction=&quot;vertical&quot;&gt;&lt;w-link&gt;编辑&lt;/w-link&gt;&lt;w-link type=&quot;danger&quot;&gt;删除&lt;/w-link&gt;&lt;/w-space&gt;&lt;/template&gt;&lt;w-button&gt;操作&lt;/w-button&gt;&lt;/w-popover&gt;"><w-popover title="操作菜单"><template #content><w-space direction="vertical"><w-link>编辑</w-link><w-link type="danger">删除</w-link></w-space></template><w-button>操作</w-button></w-popover></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'

const dialogs = reactive({ basic: false, wide: false, mask: false, nested: false })
const drawers = reactive({ right: false, bottom: false, left: false, stay: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)

const alert = (msg: string) => window.alert(msg)

const title = 'Popover 弹出框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
