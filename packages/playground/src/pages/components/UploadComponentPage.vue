<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="文件上传" id="upload" doc="upload">

      <demo-block title="单文件" code="&lt;w-upload /&gt;"><w-upload /></demo-block>
      <demo-block title="多文件" code="&lt;w-upload multiple /&gt;"><w-upload multiple /></demo-block>

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

const title = 'Upload 上传器'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
