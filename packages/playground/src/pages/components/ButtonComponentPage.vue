<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('基础操作按钮，支持多种类型和尺寸')" id="button" doc="button">

            <demo-block :title="t('按钮类型')" code="&lt;w-space wrap&gt;
        &lt;w-button&gt;默认&lt;/w-button&gt;
        &lt;w-button type=&quot;primary&quot;&gt;主要&lt;/w-button&gt;
        &lt;w-button type=&quot;success&quot;&gt;成功&lt;/w-button&gt;
        &lt;w-button type=&quot;warning&quot;&gt;警告&lt;/w-button&gt;
        &lt;w-button type=&quot;danger&quot;&gt;危险&lt;/w-button&gt;
        &lt;w-button type=&quot;info&quot;&gt;信息&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space wrap>
                <w-button>{{ t('默认') }}</w-button>
                <w-button type="primary">{{ t('主要') }}</w-button>
                <w-button type="success">{{ t('成功') }}</w-button>
                <w-button type="warning">{{ t('警告') }}</w-button>
                <w-button type="danger">{{ t('危险') }}</w-button>
                <w-button type="info">{{ t('信息') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('朴素按钮')" code="&lt;w-space&gt;
        &lt;w-button plain&gt;朴素&lt;/w-button&gt;
        &lt;w-button type=&quot;primary&quot; plain&gt;主要朴素&lt;/w-button&gt;
        &lt;w-button type=&quot;danger&quot; plain&gt;危险朴素&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-button plain>{{ t('朴素') }}</w-button>
                <w-button type="primary" plain>{{ t('主要朴素') }}</w-button>
                <w-button type="danger" plain>{{ t('危险朴素') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('圆角按钮')" code="&lt;w-space&gt;
        &lt;w-button round&gt;圆角&lt;/w-button&gt;
        &lt;w-button type=&quot;primary&quot; round&gt;主要圆角&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-button round>{{ t('圆角') }}</w-button>
                <w-button type="primary" round>{{ t('主要圆角') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('按钮尺寸')" code="&lt;w-space&gt;
        &lt;w-button size=&quot;large&quot;&gt;大号&lt;/w-button&gt;
        &lt;w-button&gt;默认&lt;/w-button&gt;
        &lt;w-button size=&quot;small&quot;&gt;小号&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-button size="large">{{ t('大号') }}</w-button>
                <w-button>{{ t('默认') }}</w-button>
                <w-button size="small">{{ t('小号') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('禁用状态')" code="&lt;w-space&gt;
        &lt;w-button disabled&gt;禁用&lt;/w-button&gt;
        &lt;w-button type=&quot;primary&quot; disabled&gt;禁用主要&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-button disabled>{{ t('禁用') }}</w-button>
                <w-button type="primary" disabled>{{ t('禁用主要') }}</w-button>
              </w-space>
            </demo-block>
            <demo-block :title="t('图标按钮')" code="&lt;w-space&gt;
        &lt;w-button icon=&quot;search&quot;&gt;搜索&lt;/w-button&gt;
        &lt;w-button type=&quot;primary&quot; icon=&quot;arrowRight&quot;&gt;下一步&lt;/w-button&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-button icon="search">{{ t('搜索') }}</w-button>
                <w-button type="primary" icon="arrowRight">{{ t('下一步') }}</w-button>
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

const title = t('Button 按钮')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
