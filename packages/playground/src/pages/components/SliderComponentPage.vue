<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="数值滑块选择" id="slider" doc="slider">

      <demo-block title="基础用法" code="&lt;w-slider v-model=&quot;form.slider&quot; /&gt;"><w-slider v-model="form.slider" /></demo-block>
      <demo-block title="显示断点" code="&lt;w-slider v-model=&quot;form.slider&quot; :step=&quot;10&quot; show-stops /&gt;"><w-slider v-model="form.slider" :step="10" show-stops /></demo-block>
      <demo-block title="范围" code="&lt;w-slider v-model=&quot;form.slider&quot; :min=&quot;0&quot; :max=&quot;100&quot; /&gt;"><w-slider v-model="form.slider" :min="0" :max="100" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Slider 滑块'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
