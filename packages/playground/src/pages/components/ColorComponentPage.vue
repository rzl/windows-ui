<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('主题色彩展示板')" id="color" doc="color">

      <demo-block :title="t('色彩面板')" :code="ColorCode1">
        <w-color />
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

const title = t('Color 色彩')

const ColorCode1 = `<w-color />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
