<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('单项选择')" id="radio" doc="radio">

            <demo-block :title="t('基础用法')" code="&lt;w-radio v-model=&quot;form.radio&quot; label=&quot;A&quot;&gt;选项A&lt;/w-radio&gt;
      &lt;w-radio v-model=&quot;form.radio&quot; label=&quot;B&quot;&gt;选项B&lt;/w-radio&gt;
      &lt;w-radio v-model=&quot;form.radio&quot; label=&quot;C&quot;&gt;选项C&lt;/w-radio&gt;">
              <w-radio v-model="form.radio" label="A">选项A</w-radio>
              <w-radio v-model="form.radio" label="B">选项B</w-radio>
              <w-radio v-model="form.radio" label="C">选项C</w-radio>
            </demo-block>
            <demo-block :title="t('禁用')" code="&lt;w-radio v-model=&quot;form.radio&quot; label=&quot;D&quot; disabled&gt;禁用选项&lt;/w-radio&gt;"><w-radio v-model="form.radio" label="D" disabled>禁用选项</w-radio></demo-block>

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

const title = t('Radio 单选框')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
