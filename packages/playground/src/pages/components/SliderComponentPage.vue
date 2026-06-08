<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="数值滑块选择" id="slider" doc="slider">

      <demo-block title="基础用法" code="&lt;w-slider v-model=&quot;form.slider1&quot; /&gt;"><w-slider v-model="form.slider1" /></demo-block>
      <demo-block title="显示断点" code="&lt;w-slider v-model=&quot;form.slider2&quot; :step=&quot;10&quot; show-stops /&gt;"><w-slider v-model="form.slider2" :step="10" show-stops /></demo-block>
      <demo-block title="范围" code="&lt;w-slider v-model=&quot;form.slider3&quot; :min=&quot;0&quot; :max=&quot;100&quot; /&gt;"><w-slider v-model="form.slider3" :min="0" :max="100" /></demo-block>
      <demo-block title="显示上下限" code="&lt;w-slider v-model=&quot;form.slider4&quot; show-min-max /&gt;"><w-slider v-model="form.slider4" show-min-max /></demo-block>
      <demo-block title="自定义上下限" code="&lt;w-slider v-model=&quot;form.slider5&quot; show-min-max&gt;&#10;  &lt;template #min=&quot;{ value }&quot;&gt;最小: {{ value }}&lt;/template&gt;&#10;  &lt;template #max=&quot;{ value }&quot;&gt;最大: {{ value }}&lt;/template&gt;&#10;&lt;/w-slider&gt;">
        <w-slider v-model="form.slider5" show-min-max>
          <template #min="{ value }">最小: {{ value }}</template>
          <template #max="{ value }">最大: {{ value }}</template>
        </w-slider>
      </demo-block>

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
  date: '', date2: '', datetime: '', radio: 'A', rate: 3, select: '', slider1: 30, slider2: 30, slider3: 30, slider4: 30, slider5: 30,
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

const title = 'Slider 滑块'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
