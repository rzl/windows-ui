<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="单项选择" id="radio" doc="radio">

            <demo-block title="基础用法" code="&lt;w-radio v-model=&quot;form.radio&quot; label=&quot;A&quot;&gt;选项A&lt;/w-radio&gt;
      &lt;w-radio v-model=&quot;form.radio&quot; label=&quot;B&quot;&gt;选项B&lt;/w-radio&gt;
      &lt;w-radio v-model=&quot;form.radio&quot; label=&quot;C&quot;&gt;选项C&lt;/w-radio&gt;">
              <w-radio v-model="form.radio" label="A">选项A</w-radio>
              <w-radio v-model="form.radio" label="B">选项B</w-radio>
              <w-radio v-model="form.radio" label="C">选项C</w-radio>
            </demo-block>
            <demo-block title="禁用" code="&lt;w-radio v-model=&quot;form.radio&quot; label=&quot;D&quot; disabled&gt;禁用选项&lt;/w-radio&gt;"><w-radio v-model="form.radio" label="D" disabled>禁用选项</w-radio></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Radio 单选框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
