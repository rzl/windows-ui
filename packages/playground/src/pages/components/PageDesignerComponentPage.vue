<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('可视化拖拽搭建低代码页面')" id="page-designer" doc="page-designer">

      <demo-block :title="t('基础用法')" :code="codeBasic">
        <div class="designer-wrapper">
          <w-page-designer
            code="demo"
            :config="designerConfig"
            @save="handleSave"
            @back="handleBack"
            @preview="handlePreview"
          />
        </div>
        <p class="demo-note">{{ t('提示：点击工具栏「保存」可在控制台看到页面配置') }}</p>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import type { PageConfig } from '@windows-ui/core'

const { t } = useI18n()
const title = 'PageDesigner 页面设计器'

const designerConfig: PageConfig = {
  title: '示例页面',
  components: [
    {
      id: 'text_1',
      type: 'text',
      props: { content: '这是一段示例文本', tag: 'p', align: 'left' },
      styles: {}
    },
    {
      id: 'stat_1',
      type: 'stat',
      props: { title: '访问量', icon: 'eye', color: 'primary' },
      styles: { marginTop: '16px' },
      dataSource: { type: 'static', value: 1024 }
    }
  ]
}

function handleSave(data: any) {
  // eslint-disable-next-line no-console
  console.log('page save', data)
  window.alert(t('已保存，配置见控制台'))
}

function handleBack() {
  window.alert(t('返回事件'))
}

function handlePreview() {
  // eslint-disable-next-line no-console
  console.log('page preview')
}

const codeBasic = `<script setup>
const designerConfig = {
  title: '示例页面',
  components: [
    { id: 'text_1', type: 'text', props: { content: '这是一段示例文本', tag: 'p', align: 'left' }, styles: {} },
    { id: 'stat_1', type: 'stat', props: { title: '访问量', icon: 'eye', color: 'primary' }, styles: { marginTop: '16px' }, dataSource: { type: 'static', value: 1024 } }
  ]
}

function handleSave(data) {
  console.log('page save', data)
}
<\/script>

<template>
  <w-page-designer code="demo" :config="designerConfig" @save="handleSave" />
<\/template>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.designer-wrapper { border: 1px solid #d4d0c8; min-height: 600px; overflow: hidden; }
.demo-note { margin-top: 12px; font-size: 12px; color: #666; }
</style>
