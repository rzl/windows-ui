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

            <demo-block title="全局尺寸" code="&lt;w-config-provider size=&quot;large&quot;&gt;
        &lt;w-button&gt;大按钮&lt;/w-button&gt;
        &lt;w-input placeholder=&quot;大输入框&quot; /&gt;
        &lt;w-tag&gt;大标签&lt;/w-tag&gt;
      &lt;/w-config-provider&gt;">
              <w-config-provider size="large">
                <w-button>大按钮</w-button>
                <w-input placeholder="大输入框" style="margin-left:8px" />
                <w-tag style="margin-left:8px">大标签</w-tag>
              </w-config-provider>
            </demo-block>

            <demo-block title="主题色配置" code="&lt;w-config-provider :theme=&quot;{ primary: '#c43e3e', danger: '#c43e3e' }&quot;&gt;
        &lt;w-button type=&quot;primary&quot;&gt;主题按钮&lt;/w-button&gt;
        &lt;w-link type=&quot;primary&quot;&gt;主题链接&lt;/w-link&gt;
        &lt;w-tag type=&quot;primary&quot;&gt;主题标签&lt;/w-tag&gt;
      &lt;/w-config-provider&gt;">
              <w-config-provider :theme="{ primary: '#c43e3e', danger: '#c43e3e' }">
                <w-button type="primary">主题按钮</w-button>
                <w-link type="primary" style="margin-left:8px">主题链接</w-link>
                <w-tag type="primary" style="margin-left:8px">主题标签</w-tag>
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
