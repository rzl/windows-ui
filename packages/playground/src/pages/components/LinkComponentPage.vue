<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('文字链接')" id="link" doc="link">

            <demo-block :title="t('链接类型')" code="&lt;w-space&gt;
        &lt;w-link&gt;默认链接&lt;/w-link&gt;
        &lt;w-link type=&quot;primary&quot;&gt;主要链接&lt;/w-link&gt;
        &lt;w-link type=&quot;success&quot;&gt;成功链接&lt;/w-link&gt;
        &lt;w-link type=&quot;warning&quot;&gt;警告链接&lt;/w-link&gt;
        &lt;w-link type=&quot;danger&quot;&gt;危险链接&lt;/w-link&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-link>默认链接</w-link>
                <w-link type="primary">主要链接</w-link>
                <w-link type="success">成功链接</w-link>
                <w-link type="warning">警告链接</w-link>
                <w-link type="danger">危险链接</w-link>
              </w-space>
            </demo-block>
            <demo-block :title="t('无下划线')" code="&lt;w-link :underline=&quot;false&quot;&gt;无下划线&lt;/w-link&gt;">
              <w-link :underline="false">无下划线</w-link>
            </demo-block>
            <demo-block :title="t('禁用状态')" code="&lt;w-link disabled&gt;禁用链接&lt;/w-link&gt;">
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
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
