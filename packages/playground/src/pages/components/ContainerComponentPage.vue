<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('内容容器')" id="container" doc="container">

      <demo-block :title="t('固定宽度容器')" :code="ContainerCode1">
        <w-container><p>这是一个固定最大宽度 960px 的容器</p></w-container>
      </demo-block>
      <demo-block :title="t('流式容器')" :code="ContainerCode2">
        <w-container fluid><p>这是一个占满宽度的流式容器</p></w-container>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const iconNames = ['info','warning','error','success','close','folder','file','search','user','star','arrowUp','arrowDown','arrowLeft','arrowRight','menu','home','loading']

const title = t('Container 布局容器')

const ContainerCode1 = `<w-container><p>这是一个固定最大宽度 960px 的容器</p></w-container>`
const ContainerCode2 = `<w-container fluid><p>这是一个占满宽度的流式容器</p></w-container>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
