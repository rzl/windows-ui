<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="内容切换" id="tabs" doc="tabs">

            <demo-block title="基础用法" code="&lt;w-tabs :tabs=&quot;[{ label: '标签1' }, { label: '标签2' }, { label: '标签3' }]&quot;&gt;
        &lt;template #default=&quot;{ active }&quot;&gt;&lt;div v-if=&quot;active === 0&quot;&gt;内容1&lt;/div&gt;&lt;div v-if=&quot;active === 1&quot;&gt;内容2&lt;/div&gt;&lt;div v-if=&quot;active === 2&quot;&gt;内容3&lt;/div&gt;&lt;/template&gt;
      &lt;/w-tabs&gt;">
              <w-tabs :tabs="[{ label: '标签1' }, { label: '标签2' }, { label: '标签3' }]">
                <template #default="{ active }"><div v-if="active === 0">内容1</div><div v-if="active === 1">内容2</div><div v-if="active === 2">内容3</div></template>
              </w-tabs>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const alert = (msg: string) => window.alert(msg)

const title = 'Tabs 标签页'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
