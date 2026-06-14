<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('文字链接')" id="link" doc="link">

            <demo-block :title="t('链接类型')" :code="LinkCode1">
              <w-space>
                <w-link>默认链接</w-link>
                <w-link type="primary">主要链接</w-link>
                <w-link type="success">成功链接</w-link>
                <w-link type="warning">警告链接</w-link>
                <w-link type="danger">危险链接</w-link>
              </w-space>
            </demo-block>
            <demo-block :title="t('无下划线')" :code="LinkCode2">
              <w-link :underline="false">无下划线</w-link>
            </demo-block>
            <demo-block :title="t('禁用状态')" :code="LinkCode3">
              <w-link disabled>禁用链接</w-link>
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

const title = t('Link 链接')

const LinkCode1 = `<w-space>
        <w-link>默认链接</w-link>
        <w-link type="primary">主要链接</w-link>
        <w-link type="success">成功链接</w-link>
        <w-link type="warning">警告链接</w-link>
        <w-link type="danger">危险链接</w-link>
      </w-space>`
const LinkCode2 = `<w-link :underline="false">无下划线</w-link>`
const LinkCode3 = `<w-link disabled>禁用链接</w-link>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
