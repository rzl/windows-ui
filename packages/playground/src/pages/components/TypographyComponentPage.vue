<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('文章排版样式')" id="typography" doc="typography">

            <demo-block :title="t('排版示例')" :code="TypographyCode1">
              <w-typography>
                <h1>一级标题</h1>
                <h2>二级标题</h2>
                <h3>三级标题</h3>
                <p>这是一段普通文本，<strong>加粗文本</strong>，<em>斜体文本</em>。</p>
                <p>代码片段：<code>const app = createApp(App)</code></p>
              </w-typography>
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

const title = t('Typography 排版')

const TypographyCode1 = `<w-typography>
  <h1>一级标题</h1>
  <h2>二级标题</h2>
  <h3>三级标题</h3>
  <p>这是一段普通文本，<strong>加粗文本</strong>，<em>斜体文本</em>。</p>
  <p>代码片段：<code>const app = createApp(App)</code></p>
</w-typography>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
