<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="多项选择" id="checkbox" doc="checkbox">

            <demo-block title="基础用法" code="&lt;w-checkbox v-model=&quot;form.checkbox&quot; label=&quot;A&quot;&gt;选项A&lt;/w-checkbox&gt;
      &lt;w-checkbox v-model=&quot;form.checkbox&quot; label=&quot;B&quot;&gt;选项B&lt;/w-checkbox&gt;
      &lt;w-checkbox v-model=&quot;form.checkbox&quot; label=&quot;C&quot;&gt;选项C&lt;/w-checkbox&gt;">
              <w-checkbox v-model="form.checkbox" label="A">选项A</w-checkbox>
              <w-checkbox v-model="form.checkbox" label="B">选项B</w-checkbox>
              <w-checkbox v-model="form.checkbox" label="C">选项C</w-checkbox>
            </demo-block>
            <demo-block title="禁用" code="&lt;w-checkbox v-model=&quot;form.checkbox&quot; label=&quot;D&quot; disabled&gt;禁用选项&lt;/w-checkbox&gt;"><w-checkbox v-model="form.checkbox" label="D" disabled>禁用选项</w-checkbox></demo-block>
            <demo-block title="半选状态" code="&lt;w-checkbox :indeterminate=&quot;true&quot;&gt;半选&lt;/w-checkbox&gt;"><w-checkbox :indeterminate="true">半选</w-checkbox></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Checkbox 多选框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
