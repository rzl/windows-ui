<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('轻量富文本编辑器')" id="rich-text" doc="rich-text">

      <demo-block :title="t('基础用法')" code="&lt;w-rich-text v-model=\"content\" /&gt;">
        <w-rich-text v-model="content" />
        <p style="margin-top: 8px; font-size: 12px; color: #666;">HTML: {{ content }}</p>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { ref } from 'vue'
const { t } = useI18n()

const content = ref('<p>Hello <b>World</b></p>')
const title = t('RichText 富文本')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
