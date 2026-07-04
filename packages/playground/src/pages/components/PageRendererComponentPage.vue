<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('通过 JSON 配置渲染低代码页面')" id="page-renderer" doc="page-renderer">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <w-page-renderer :config="config" preview />
      </demo-block>

      <demo-block :title="t('异步加载页面')" :code="codeAsync">
        <w-page-renderer code="demo-page" :load-page="loadPage" preview />
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import type { PageConfig } from '@windows-ui/core'

const { t } = useI18n()
const title = 'PageRenderer 页面渲染器'

const config = ref<PageConfig>({
  title: '演示页面',
  components: [
    {
      id: 't1',
      type: 'text',
      props: { content: '欢迎使用页面渲染器', tag: 'h3', align: 'center' },
      styles: { marginBottom: '16px' }
    },
    {
      id: 's1',
      type: 'statistic',
      props: { title: '今日访问', icon: 'user', color: 'primary' },
      styles: { marginBottom: '16px' },
      dataSource: { type: 'static', value: 1280 }
    },
    {
      id: 'n1',
      type: 'alert',
      props: { content: '这是一条公告信息', type: 'info' },
      styles: {}
    }
  ]
})

function loadPage(_code: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 'demo-page',
        name: '异步演示页面',
        config: config.value
      })
    }, 300)
  })
}

const codeBasic = `<script setup>
import { ref } from 'vue'

const config = ref({
  title: '演示页面',
  components: [
    { id: 't1', type: 'text', props: { content: '欢迎使用页面渲染器', tag: 'h3', align: 'center' }, styles: {} },
    { id: 's1', type: 'statistic', props: { title: '今日访问', icon: 'user', color: 'primary' }, styles: {}, dataSource: { type: 'static', value: 1280 } },
    { id: 'n1', type: 'alert', props: { content: '这是一条公告信息', type: 'info' }, styles: {} }
  ]
})
<\/script>

<template>
  <w-page-renderer :config="config" preview />
<\/template>`

const codeAsync = `<script setup>
function loadPage(code) {
  return fetch(\`/api/page/\${code}\`).then((res) => res.json())
}
<\/script>

<template>
  <w-page-renderer code="demo-page" :load-page="loadPage" preview />
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
