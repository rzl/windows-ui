<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('数字输入与步进控制')" id="input-number" doc="input-number">

      <demo-block :title="t('基础用法')" :code="InputNumberCode1"><w-input-number v-model="form.number" :min="0" :max="100" /></demo-block>
      <demo-block :title="t('步进')" :code="InputNumberCode2"><w-input-number v-model="form.number" :step="5" /></demo-block>
      <demo-block :title="t('禁用')" :code="InputNumberCode3"><w-input-number v-model="form.number" disabled /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive } from 'vue'
const { t } = useI18n()

const form = reactive({
  input: '', input2: '', number: 0, tags: [t('标签1'), t('标签2')], otp: '', otp2: '',
  auto: '', cascader: [] as string[], checkbox: [] as string[], color: '#245edb',
  date: '', date2: '', datetime: '', radio: 'A', rate: 3, select: '', slider: 30,
  switch: true, time: '', timeselect: '', transfer: [] as string[], treeselect: '',
  mention: '', name: '', email: '', gender: 'male', hobbies: [] as string[]
})

const autocompleteOptions = [{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }, { label: 'Cherry', value: 'cherry' }, { label: 'Date', value: 'date' }]
const cascaderOptions = [{ label: t('北京'), value: 'beijing', children: [{ label: t('朝阳区'), value: 'chaoyang' }, { label: t('海淀区'), value: 'haidian' }] }, { label: t('上海'), value: 'shanghai', children: [{ label: t('浦东新区'), value: 'pudong' }] }]
const selectOptions = [{ label: t('选项1'), value: '1' }, { label: t('选项2'), value: '2' }, { label: t('选项3'), value: '3' }]
const transferData = [{ key: '1', label: t('项目1') }, { key: '2', label: t('项目2') }, { key: '3', label: t('项目3') }, { key: '4', label: t('项目4') }]
const treeData = [{ label: t('节点1'), value: '1', children: [{ label: t('子节点1-1'), value: '1-1' }] }, { label: t('节点2'), value: '2' }]
const mentionOptions = [{ label: t('张三'), value: 'zhangsan' }, { label: t('李四'), value: 'lisi' }, { label: t('王五'), value: 'wangwu' }]

const message = (msg: string) => alert(msg)

const title = t('Input Number 数字输入框')

const InputNumberCode1 = `<w-input-number v-model="form.number" :min="0" :max="100" />`
const InputNumberCode2 = `<w-input-number v-model="form.number" :step="5" />`
const InputNumberCode3 = `<w-input-number v-model="form.number" disabled />`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
