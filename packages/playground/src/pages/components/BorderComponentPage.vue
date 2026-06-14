<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('XP 风格的边框样式')" id="border" doc="border">

            <demo-block :title="t('边框类型')" :code="BorderCode1">
              <w-space>
                <w-border type="raised" style="padding:16px">凸起边框 (Raised)</w-border>
                <w-border type="sunken" style="padding:16px">凹陷边框 (Sunken)</w-border>
                <w-border type="field" style="padding:16px">字段边框 (Field)</w-border>
              </w-space>
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

const title = t('Border 边框')

const BorderCode1 = `<w-space>
        <w-border type="raised" style="padding:16px">凸起边框 (Raised)</w-border>
        <w-border type="sunken" style="padding:16px">凹陷边框 (Sunken)</w-border>
        <w-border type="field" style="padding:16px">字段边框 (Field)</w-border>
      </w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
