<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('元素间距容器')" id="space" doc="space">

            <demo-block :title="t('水平间距')" :code="SpaceCode1">
              <w-space>
                <w-tag>标签1</w-tag>
                <w-tag>标签2</w-tag>
                <w-tag>标签3</w-tag>
              </w-space>
            </demo-block>
            <demo-block :title="t('垂直间距')" :code="SpaceCode2">
              <w-space direction="vertical">
                <w-tag>标签1</w-tag>
                <w-tag>标签2</w-tag>
                <w-tag>标签3</w-tag>
              </w-space>
            </demo-block>
            <demo-block :title="t('自定义间距')" :code="SpaceCode3">
              <w-space :size="24">
                <w-button>{{ t('按钮1') }}</w-button>
                <w-button>{{ t('按钮2') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('自动换行')" :code="SpaceCode4">
              <w-space wrap>
                <w-tag v-for="i in 10" :key="i">标签{{ i }}</w-tag>
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

const title = t('Space 间距')

const SpaceCode1 = `<w-space>
        <w-tag>标签1</w-tag>
        <w-tag>标签2</w-tag>
        <w-tag>标签3</w-tag>
      </w-space>`
const SpaceCode2 = `<w-space direction="vertical">
        <w-tag>标签1</w-tag>
        <w-tag>标签2</w-tag>
        <w-tag>标签3</w-tag>
      </w-space>`
const SpaceCode3 = `<w-space :size="24">
        <w-button>按钮1</w-button>
        <w-button>按钮2</w-button>
      </w-space>`
const SpaceCode4 = `<w-space wrap>
        <w-tag v-for="i in 10" :key="i">标签{{ i }}</w-tag>
      </w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
