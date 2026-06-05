<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="输入联想补全" id="autocomplete" doc="autocomplete">

      <demo-block title="基础用法" code="&lt;w-autocomplete v-model=&quot;form.auto&quot; :options=&quot;autocompleteOptions&quot; placeholder=&quot;输入水果名称&quot; /&gt;"><w-autocomplete v-model="form.auto" :options="autocompleteOptions" placeholder="输入水果名称" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Autocomplete 自动补全'
const form = reactive({ auto: '' })
const autocompleteOptions = [
  { value: '苹果', label: '苹果' },
  { value: '香蕉', label: '香蕉' },
  { value: '橙子', label: '橙子' },
]
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
