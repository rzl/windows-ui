<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('数值滑块选择')" id="slider" doc="slider">

      <demo-block :title="t('基础用法')" code="&lt;w-slider v-model=&quot;form.slider1&quot; /&gt;"><w-slider v-model="form.slider1" /></demo-block>
      <demo-block :title="t('显示断点')" code="&lt;w-slider v-model=&quot;form.slider2&quot; :step=&quot;10&quot; show-stops /&gt;"><w-slider v-model="form.slider2" :step="10" show-stops /></demo-block>
      <demo-block :title="t('断点与上下限')" code="&lt;w-slider v-model=&quot;form.slider6&quot; :step=&quot;10&quot; show-stops show-min-max /&gt;"><w-slider v-model="form.slider6" :step="10" show-stops show-min-max /></demo-block>
      <demo-block :title="t('范围')" code="&lt;w-slider v-model=&quot;form.slider3&quot; :min=&quot;0&quot; :max=&quot;100&quot; /&gt;"><w-slider v-model="form.slider3" :min="0" :max="100" /></demo-block>
      <demo-block :title="t('显示上下限')" code="&lt;w-slider v-model=&quot;form.slider4&quot; show-min-max /&gt;"><w-slider v-model="form.slider4" show-min-max /></demo-block>
      <demo-block :title="t('自定义上下限')" code="&lt;w-slider v-model=&quot;form.slider5&quot; show-min-max&gt;&#10;  &lt;template #min=&quot;{ value }&quot;&gt;最小: {{ value }}&lt;/template&gt;&#10;  &lt;template #max=&quot;{ value }&quot;&gt;最大: {{ value }}&lt;/template&gt;&#10;&lt;/w-slider&gt;">
        <w-slider v-model="form.slider5" show-min-max>
          <template #min="{ value }">最小: {{ value }}</template>
          <template #max="{ value }">最大: {{ value }}</template>
        </w-slider>
      </demo-block>
      <demo-block :title="t('范围 10 ~ 50')" code="&lt;w-slider v-model=&quot;form.slider7&quot; :min=&quot;10&quot; :max=&quot;50&quot; show-min-max /&gt;"><w-slider v-model="form.slider7" :min="10" :max="50" show-min-max /></demo-block>
      <demo-block :title="t('范围 20 ~ 80（断点）')" code="&lt;w-slider v-model=&quot;form.slider8&quot; :min=&quot;20&quot; :max=&quot;80&quot; :step=&quot;10&quot; show-stops show-min-max /&gt;"><w-slider v-model="form.slider8" :min="20" :max="80" :step="10" show-stops show-min-max /></demo-block>
      <demo-block :title="t('范围 5 ~ 45')" code="&lt;w-slider v-model=&quot;form.slider9&quot; :min=&quot;5&quot; :max=&quot;45&quot; show-min-max /&gt;"><w-slider v-model="form.slider9" :min="5" :max="45" show-min-max /></demo-block>
      <demo-block :title="t('范围 30 ~ 70（断点）')" code="&lt;w-slider v-model=&quot;form.slider10&quot; :min=&quot;30&quot; :max=&quot;70&quot; :step=&quot;5&quot; show-stops show-min-max /&gt;"><w-slider v-model="form.slider10" :min="30" :max="70" :step="5" show-stops show-min-max /></demo-block>
      <demo-block :title="t('范围 3 ~ 72（步长 5）')" code="&lt;w-slider v-model=&quot;form.slider11&quot; :min=&quot;3&quot; :max=&quot;72&quot; :step=&quot;5&quot; show-stops show-min-max /&gt;"><w-slider v-model="form.slider11" :min="3" :max="72" :step="5" show-stops show-min-max /></demo-block>
      <demo-block :title="t('范围 7 ~ 43（步长 3）')" code="&lt;w-slider v-model=&quot;form.slider12&quot; :min=&quot;7&quot; :max=&quot;43&quot; :step=&quot;3&quot; show-stops show-min-max /&gt;"><w-slider v-model="form.slider12" :min="7" :max="43" :step="3" show-stops show-min-max /></demo-block>
      <demo-block :title="t('范围 12 ~ 68（步长 8）')" code="&lt;w-slider v-model=&quot;form.slider13&quot; :min=&quot;12&quot; :max=&quot;68&quot; :step=&quot;8&quot; show-stops show-min-max /&gt;"><w-slider v-model="form.slider13" :min="12" :max="68" :step="8" show-stops show-min-max /></demo-block>
      <demo-block :title="t('显示 0~100，可选 20~80')" code="&lt;w-slider v-model=&quot;form.slider14&quot; :min=&quot;0&quot; :max=&quot;100&quot; :range-min=&quot;20&quot; :range-max=&quot;80&quot; show-min-max /&gt;"><w-slider v-model="form.slider14" :min="0" :max="100" :range-min="20" :range-max="80" show-min-max /></demo-block>

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
  date: '', date2: '', datetime: '', radio: 'A', rate: 3, select: '', slider1: 30, slider2: 30, slider3: 30, slider4: 30, slider5: 30, slider6: 30, slider7: 30, slider8: 50, slider9: 25, slider10: 50, slider11: 33, slider12: 22, slider13: 36, slider14: 50,
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

const title = t('Slider 滑块')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
