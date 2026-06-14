<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('Flex 布局容器')" id="layout" doc="layout">

            <demo-block :title="t('垂直布局')" :code="LayoutCode1">
              <w-layout direction="vertical">
                <w-button>{{ t('上') }}</w-button>
                <w-button>{{ t('中') }}</w-button>
                <w-button>{{ t('下') }}</w-button>
              </w-layout>
            </demo-block>
            <demo-block :title="t('水平布局')" :code="LayoutCode2">
              <w-layout direction="horizontal">
                <w-button>{{ t('左') }}</w-button>
                <w-button>{{ t('中') }}</w-button>
                <w-button>{{ t('右') }}</w-button>
              </w-layout>
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

const title = t('Layout 布局')

const LayoutCode1 = `<w-layout direction="vertical">
        <w-button>上</w-button>
        <w-button>中</w-button>
        <w-button>下</w-button>
      </w-layout>`
const LayoutCode2 = `<w-layout direction="horizontal">
        <w-button>左</w-button>
        <w-button>中</w-button>
        <w-button>右</w-button>
      </w-layout>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
