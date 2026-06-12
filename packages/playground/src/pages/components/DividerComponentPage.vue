<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('内容分隔，支持水平和垂直')" id="divider" doc="divider">

      <demo-block :title="t('基础分割线')" code="&lt;p&gt;上方内容&lt;/p&gt;&lt;w-divider /&gt;&lt;p&gt;下方内容&lt;/p&gt;"><p>上方内容</p><w-divider /><p>下方内容</p></demo-block>
      <demo-block :title="t('带文字')" code="&lt;p&gt;章节开始&lt;/p&gt;&lt;w-divider&gt;第一章&lt;/w-divider&gt;&lt;p&gt;章节内容...&lt;/p&gt;&lt;w-divider&gt;第二章&lt;/w-divider&gt;&lt;p&gt;更多内容...&lt;/p&gt;"><p>章节开始</p><w-divider>第一章</w-divider><p>章节内容...</p><w-divider>第二章</w-divider><p>更多内容...</p></demo-block>
      <demo-block :title="t('垂直分割')" code="&lt;w-space&gt;&lt;span&gt;文本&lt;/span&gt;&lt;w-divider direction=&quot;vertical&quot; /&gt;&lt;a href=&quot;#&quot;&gt;链接&lt;/a&gt;&lt;w-divider direction=&quot;vertical&quot; /&gt;&lt;w-icon name=&quot;search&quot; /&gt;&lt;w-divider direction=&quot;vertical&quot; /&gt;&lt;span&gt;文本&lt;/span&gt;&lt;/w-space&gt;"><w-space><span>文本</span><w-divider direction="vertical" /><a href="#">链接</a><w-divider direction="vertical" /><w-icon name="search" /><w-divider direction="vertical" /><span>文本</span></w-space></demo-block>
      <demo-block :title="t('不同内容分隔')" code="&lt;w-card header=&quot;卡片A&quot;&gt;&lt;p&gt;卡片A内容&lt;/p&gt;&lt;/w-card&gt;&lt;w-divider /&gt;&lt;w-card header=&quot;卡片B&quot;&gt;&lt;p&gt;卡片B内容&lt;/p&gt;&lt;/w-card&gt;"><w-card :header="t('卡片A')"><p>卡片A内容</p></w-card><w-divider /><w-card :header="t('卡片B')"><p>卡片B内容</p></w-card></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const title = t('Divider 分割线')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
