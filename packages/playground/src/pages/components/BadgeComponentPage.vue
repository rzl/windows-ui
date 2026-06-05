<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="徽标数字/状态" id="badge" doc="badge">

            <demo-block title="数字徽标" code="&lt;w-badge :value=&quot;12&quot;&gt;&lt;w-button&gt;消息&lt;/w-button&gt;&lt;/w-badge&gt;"><w-badge :value="12"><w-button>消息</w-button></w-badge></demo-block>
            <demo-block title="文字徽标" code="&lt;w-badge value=&quot;new&quot;&gt;&lt;w-button&gt;新闻&lt;/w-button&gt;&lt;/w-badge&gt;"><w-badge value="new"><w-button>新闻</w-button></w-badge></demo-block>
            <demo-block title="圆点徽标" code="&lt;w-badge is-dot&gt;&lt;w-button&gt;通知&lt;/w-button&gt;&lt;/w-badge&gt;"><w-badge is-dot><w-button>通知</w-button></w-badge></demo-block>
            <demo-block title="不同类型" code="&lt;w-space&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;primary&quot;&gt;&lt;w-button&gt;主要&lt;/w-button&gt;&lt;/w-badge&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;success&quot;&gt;&lt;w-button&gt;成功&lt;/w-button&gt;&lt;/w-badge&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;warning&quot;&gt;&lt;w-button&gt;警告&lt;/w-button&gt;&lt;/w-badge&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;info&quot;&gt;&lt;w-button&gt;信息&lt;/w-button&gt;&lt;/w-badge&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-badge :value="5" type="primary"><w-button>主要</w-button></w-badge>
                <w-badge :value="5" type="success"><w-button>成功</w-button></w-badge>
                <w-badge :value="5" type="warning"><w-button>警告</w-button></w-badge>
                <w-badge :value="5" type="info"><w-button>信息</w-button></w-badge>
              </w-space>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Badge 徽章'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
