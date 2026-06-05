<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="统一配置组件前缀等" id="configprovider" doc="configprovider">

            <demo-block title="自定义前缀" code="&lt;w-config-provider prefix=&quot;xp&quot;&gt;
        &lt;xp-button type=&quot;primary&quot;&gt;自定义前缀按钮&lt;/xp-button&gt;
      &lt;/w-config-provider&gt;">
              <w-config-provider prefix="xp">
                <xp-button type="primary">自定义前缀按钮</xp-button>
              </w-config-provider>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const iconNames = ['info','warning','error','success','close','folder','file','search','user','star','arrowUp','arrowDown','arrowLeft','arrowRight','menu','home','loading']

const title = 'ConfigProvider 全局配置'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
