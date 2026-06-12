<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('输入联想补全')" id="autocomplete" doc="autocomplete">

      <demo-block :title="t('基础用法')" code="&lt;w-autocomplete v-model=&quot;form.auto&quot; :options=&quot;autocompleteOptions&quot; placeholder=&quot;输入水果名称&quot; /&gt;"><w-autocomplete v-model="form.auto" :options="autocompleteOptions" :placeholder="t('输入水果名称')" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const title = t('Autocomplete 自动补全')
const form = reactive({ auto: '' })
const autocompleteOptions = [
  { value: t('苹果'), label: t('苹果') },
  { value: t('香蕉'), label: t('香蕉') },
  { value: t('橙子'), label: t('橙子') },
]
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
