<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="内置 SVG 图标" id="icon" doc="icon">

            <demo-block title="基础图标" code="&lt;w-space wrap&gt;
        &lt;div v-for=&quot;name in iconNames&quot; :key=&quot;name&quot; class=&quot;icon-demo&quot;&gt;
          &lt;w-icon :name=&quot;name&quot; /&gt;
          &lt;span class=&quot;icon-label&quot;&gt;{{ name }}&lt;/span&gt;
        &lt;/div&gt;
      &lt;/w-space&gt;">
              <w-space wrap>
                <div v-for="name in iconNames" :key="name" class="icon-demo">
                  <w-icon :name="name" />
                  <span class="icon-label">{{ name }}</span>
                </div>
              </w-space>
            </demo-block>
            <demo-block title="图标尺寸" code="&lt;w-space&gt;
        &lt;w-icon name=&quot;search&quot; size=&quot;small&quot; /&gt;
        &lt;w-icon name=&quot;search&quot; /&gt;
        &lt;w-icon name=&quot;search&quot; size=&quot;large&quot; /&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-icon name="search" size="small" />
                <w-icon name="search" />
                <w-icon name="search" size="large" />
              </w-space>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Icon 图标'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
