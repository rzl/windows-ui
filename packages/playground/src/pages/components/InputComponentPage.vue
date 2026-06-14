<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('基础文本输入')" id="input" doc="input">

      <demo-block :title="t('基础用法')" :code="InputCode1"><w-input v-model="form.input" :placeholder="t('请输入内容')" /></demo-block>
      <demo-block :title="t('前缀/后缀图标')" :code="InputCode2"><w-input v-model="form.input" prefix-icon="search" suffix-icon="close" /></demo-block>
      <demo-block :title="t('可清空')" :code="InputCode3"><w-input v-model="form.input2" clearable :placeholder="t('输入后可清空')" /></demo-block>
      <demo-block :title="t('禁用状态')" :code="InputCode4"><w-input v-model="form.input" disabled /></demo-block>
      <demo-block :title="t('尺寸')" :code="InputCode5"><w-space><w-input v-model="form.input" size="small" placeholder="small" /><w-input v-model="form.input" placeholder="default" /><w-input v-model="form.input" size="large" placeholder="large" /></w-space></demo-block>

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

const title = t('Input 输入框')

const InputCode1 = `<w-input v-model="form.input" placeholder="请输入内容" />`
const InputCode2 = `<w-input v-model="form.input" prefix-icon="search" suffix-icon="close" />`
const InputCode3 = `<w-input v-model="form.input2" clearable placeholder="输入后可清空" />`
const InputCode4 = `<w-input v-model="form.input" disabled />`
const InputCode5 = `<w-space><w-input v-model="form.input" size="small" placeholder="small" /><w-input v-model="form.input" placeholder="default" /><w-input v-model="form.input" size="large" placeholder="large" /></w-space>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
