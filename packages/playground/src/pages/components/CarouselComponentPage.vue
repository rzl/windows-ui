<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="轮播图" id="carousel" doc="carousel">

            <demo-block title="基础用法" code="&lt;w-carousel :items=&quot;[{ color: '#245edb' }, { color: '#3a9e3a' }, { color: '#e4a010' }]&quot;&gt;
        &lt;template #default=&quot;{ item }&quot;&gt;
          &lt;div :style=&quot;{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }&quot;&gt;
            &lt;span style=&quot;color:#fff;font-size:20px&quot;&gt;Slide&lt;/span&gt;
          &lt;/div&gt;
        &lt;/template&gt;
      &lt;/w-carousel&gt;">
              <w-carousel :items="[{ color: '#245edb' }, { color: '#3a9e3a' }, { color: '#e4a010' }]">
                <template #default="{ item }">
                  <div :style="{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                    <span style="color:#fff;font-size:20px">Slide</span>
                  </div>
                </template>
              </w-carousel>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Carousel 走马灯'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
