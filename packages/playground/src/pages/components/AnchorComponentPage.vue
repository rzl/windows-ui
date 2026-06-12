<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('页面内跳转')" id="anchor" doc="anchor">

      <demo-block :title="t('基础用法')" code="&lt;w-anchor :links=&quot;[{ href: '#section1', title: '章节1' }, { href: '#section2', title: '章节2', level: 2 }, { href: '#section3', title: '章节3' }]&quot; /&gt;">
        <w-anchor :links="[{ href: '#section1', title: '章节1' }, { href: '#section2', title: '章节2', level: 2 }, { href: '#section3', title: '章节3' }]" />
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const alert = (msg: string) => window.alert(msg)

const title = t('Anchor 锚点')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
