<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="表单验证与布局" id="form" doc="form">

            <demo-block title="基础表单" code="&lt;w-form&gt;
        &lt;w-form-item label=&quot;用户名&quot;&gt;&lt;w-input v-model=&quot;form.name&quot; /&gt;&lt;/w-form-item&gt;
        &lt;w-form-item label=&quot;邮箱&quot;&gt;&lt;w-input v-model=&quot;form.email&quot; /&gt;&lt;/w-form-item&gt;
        &lt;w-form-item label=&quot;性别&quot;&gt;
          &lt;w-radio v-model=&quot;form.gender&quot; label=&quot;male&quot;&gt;男&lt;/w-radio&gt;
          &lt;w-radio v-model=&quot;form.gender&quot; label=&quot;female&quot;&gt;女&lt;/w-radio&gt;
        &lt;/w-form-item&gt;
        &lt;w-form-item label=&quot;爱好&quot;&gt;
          &lt;w-checkbox v-model=&quot;form.hobbies&quot; label=&quot;reading&quot;&gt;阅读&lt;/w-checkbox&gt;
          &lt;w-checkbox v-model=&quot;form.hobbies&quot; label=&quot;sports&quot;&gt;运动&lt;/w-checkbox&gt;
        &lt;/w-form-item&gt;
        &lt;w-form-item&gt;&lt;w-button type=&quot;primary&quot;&gt;提交&lt;/w-button&gt;&lt;/w-form-item&gt;
      &lt;/w-form&gt;">
              <w-form>
                <w-form-item label="用户名"><w-input v-model="form.name" /></w-form-item>
                <w-form-item label="邮箱"><w-input v-model="form.email" /></w-form-item>
                <w-form-item label="性别">
                  <w-radio v-model="form.gender" label="male">男</w-radio>
                  <w-radio v-model="form.gender" label="female">女</w-radio>
                </w-form-item>
                <w-form-item label="爱好">
                  <w-checkbox v-model="form.hobbies" label="reading">阅读</w-checkbox>
                  <w-checkbox v-model="form.hobbies" label="sports">运动</w-checkbox>
                </w-form-item>
                <w-form-item><w-button type="primary">提交</w-button></w-form-item>
              </w-form>
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

const title = 'Form 表单'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
