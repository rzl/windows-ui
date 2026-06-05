<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="Flex 布局容器" id="layout" doc="layout">

            <demo-block title="垂直布局" code="&lt;w-layout direction=&quot;vertical&quot;&gt;
        &lt;w-button&gt;上&lt;/w-button&gt;
        &lt;w-button&gt;中&lt;/w-button&gt;
        &lt;w-button&gt;下&lt;/w-button&gt;
      &lt;/w-layout&gt;">
              <w-layout direction="vertical">
                <w-button>上</w-button>
                <w-button>中</w-button>
                <w-button>下</w-button>
              </w-layout>
            </demo-block>
            <demo-block title="水平布局" code="&lt;w-layout direction=&quot;horizontal&quot;&gt;
        &lt;w-button&gt;左&lt;/w-button&gt;
        &lt;w-button&gt;中&lt;/w-button&gt;
        &lt;w-button&gt;右&lt;/w-button&gt;
      &lt;/w-layout&gt;">
              <w-layout direction="horizontal">
                <w-button>左</w-button>
                <w-button>中</w-button>
                <w-button>右</w-button>
              </w-layout>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Layout 布局'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
