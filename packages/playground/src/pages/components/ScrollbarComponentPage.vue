<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('XP 风格滚动条')" id="scrollbar" doc="scrollbar">

            <demo-block :title="t('纵向滚动')" code="&lt;w-scrollbar height=&quot;100px&quot;&gt;
        &lt;p v-for=&quot;i in 20&quot; :key=&quot;i&quot;&gt;滚动内容行 {{ i }}&lt;/p&gt;
      &lt;/w-scrollbar&gt;">
              <w-scrollbar height="100px">
                <p v-for="i in 20" :key="i">滚动内容行 {{ i }}</p>
              </w-scrollbar>
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

const title = t('Scrollbar 滚动条')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
