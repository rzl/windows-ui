<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('统一配置组件前缀等')" id="configprovider" doc="configprovider">

            <demo-block :title="t('自定义前缀')" :code="ConfigproviderCode1">
              <w-config-provider prefix="xp">
                <xp-button type="primary">自定义前缀按钮</xp-button>
              </w-config-provider>
            </demo-block>

            <demo-block :title="t('全局尺寸')" :code="ConfigproviderCode2">
              <w-config-provider size="large">
                <w-button>{{ t('大按钮') }}</w-button>
                <w-input :placeholder="t('大输入框')" style="margin-left:8px" />
                <w-tag style="margin-left:8px">大标签</w-tag>
              </w-config-provider>
            </demo-block>

            <demo-block :title="t('主题色配置')" :code="ConfigproviderCode3">
              <w-config-provider :theme="{ primary: '#c43e3e', danger: '#c43e3e' }">
                <w-button type="primary">{{ t('主题按钮') }}</w-button>
                <w-link type="primary" style="margin-left:8px">主题链接</w-link>
                <w-tag type="primary" style="margin-left:8px">主题标签</w-tag>
              </w-config-provider>
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

const title = t('ConfigProvider 全局配置')

const ConfigproviderCode1 = `<w-config-provider prefix="xp">
  <xp-button type="primary">自定义前缀按钮</xp-button>
</w-config-provider>`
const ConfigproviderCode2 = `<w-config-provider size="large">
  <w-button>大按钮</w-button>
  <w-input placeholder="大输入框" />
  <w-tag>大标签</w-tag>
</w-config-provider>`
const ConfigproviderCode3 = `<w-config-provider :theme="{ primary: '#c43e3e', danger: '#c43e3e' }">
  <w-button type="primary">主题按钮</w-button>
  <w-link type="primary">主题链接</w-link>
  <w-tag type="primary">主题标签</w-tag>
</w-config-provider>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
