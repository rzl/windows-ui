<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="基础文本输入" id="input" doc="input">

      <demo-block title="基础用法" code="&lt;w-input v-model=&quot;form.input&quot; placeholder=&quot;请输入内容&quot; /&gt;"><w-input v-model="form.input" placeholder="请输入内容" /></demo-block>
      <demo-block title="前缀/后缀图标" code="&lt;w-input v-model=&quot;form.input&quot; prefix-icon=&quot;search&quot; suffix-icon=&quot;close&quot; /&gt;"><w-input v-model="form.input" prefix-icon="search" suffix-icon="close" /></demo-block>
      <demo-block title="可清空" code="&lt;w-input v-model=&quot;form.input2&quot; clearable placeholder=&quot;输入后可清空&quot; /&gt;"><w-input v-model="form.input2" clearable placeholder="输入后可清空" /></demo-block>
      <demo-block title="禁用状态" code="&lt;w-input v-model=&quot;form.input&quot; disabled /&gt;"><w-input v-model="form.input" disabled /></demo-block>
      <demo-block title="尺寸" code="&lt;w-space&gt;&lt;w-input v-model=&quot;form.input&quot; size=&quot;small&quot; placeholder=&quot;small&quot; /&gt;&lt;w-input v-model=&quot;form.input&quot; placeholder=&quot;default&quot; /&gt;&lt;w-input v-model=&quot;form.input&quot; size=&quot;large&quot; placeholder=&quot;large&quot; /&gt;&lt;/w-space&gt;"><w-space><w-input v-model="form.input" size="small" placeholder="small" /><w-input v-model="form.input" placeholder="default" /><w-input v-model="form.input" size="large" placeholder="large" /></w-space></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive } from 'vue'

const form = reactive({
  input: '', input2: '', number: 0, tags: ['标签1', '标签2'], otp: '', otp2: '',
  auto: '', cascader: [] as string[], checkbox: [] as string[], color: '#245edb',
  date: '', date2: '', datetime: '', radio: 'A', rate: 3, select: '', slider: 30,
  switch: true, time: '', timeselect: '', transfer: [] as string[], treeselect: '',
  mention: '', name: '', email: '', gender: 'male', hobbies: [] as string[]
})

const autocompleteOptions = [{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }, { label: 'Cherry', value: 'cherry' }, { label: 'Date', value: 'date' }]
const cascaderOptions = [{ label: '北京', value: 'beijing', children: [{ label: '朝阳区', value: 'chaoyang' }, { label: '海淀区', value: 'haidian' }] }, { label: '上海', value: 'shanghai', children: [{ label: '浦东新区', value: 'pudong' }] }]
const selectOptions = [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }, { label: '选项3', value: '3' }]
const transferData = [{ key: '1', label: '项目1' }, { key: '2', label: '项目2' }, { key: '3', label: '项目3' }, { key: '4', label: '项目4' }]
const treeData = [{ label: '节点1', value: '1', children: [{ label: '子节点1-1', value: '1-1' }] }, { label: '节点2', value: '2' }]
const mentionOptions = [{ label: '张三', value: 'zhangsan' }, { label: '李四', value: 'lisi' }, { label: '王五', value: 'wangwu' }]

const message = (msg: string) => alert(msg)

const title = 'Input 输入框'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
