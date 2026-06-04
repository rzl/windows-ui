<template>
  <div class="demo-page">
    <h1 class="page-title">📝 Form 表单组件</h1>

    <demo-section title="Input 输入框" description="基础文本输入">
      <demo-block title="基础用法"><w-input v-model="form.input" placeholder="请输入内容" /></demo-block>
      <demo-block title="前缀/后缀图标"><w-input v-model="form.input" prefix-icon="search" suffix-icon="close" /></demo-block>
      <demo-block title="可清空"><w-input v-model="form.input2" clearable placeholder="输入后可清空" /></demo-block>
      <demo-block title="禁用状态"><w-input v-model="form.input" disabled /></demo-block>
      <demo-block title="尺寸"><w-space><w-input v-model="form.input" size="small" placeholder="small" /><w-input v-model="form.input" placeholder="default" /><w-input v-model="form.input" size="large" placeholder="large" /></w-space></demo-block>
    </demo-section>

    <demo-section title="Input Number 数字输入框" description="数字输入与步进控制">
      <demo-block title="基础用法"><w-input-number v-model="form.number" :min="0" :max="100" /></demo-block>
      <demo-block title="步进"><w-input-number v-model="form.number" :step="5" /></demo-block>
      <demo-block title="禁用"><w-input-number v-model="form.number" disabled /></demo-block>
    </demo-section>

    <demo-section title="Input Tag 标签输入框" description="输入生成标签">
      <demo-block title="基础用法"><w-input-tag v-model="form.tags" placeholder="输入后按回车" /></demo-block>
      <demo-block title="最大数量"><w-input-tag v-model="form.tags" :max="3" placeholder="最多3个标签" /></demo-block>
    </demo-section>

    <demo-section title="Input OTP 验证码" description="一次性密码输入">
      <demo-block title="6位验证码"><w-input-otp v-model="form.otp" :length="6" /></demo-block>
      <demo-block title="4位验证码"><w-input-otp v-model="form.otp2" :length="4" /></demo-block>
    </demo-section>

    <demo-section title="Autocomplete 自动补全" description="输入联想补全">
      <demo-block title="基础用法"><w-autocomplete v-model="form.auto" :options="autocompleteOptions" placeholder="输入水果名称" /></demo-block>
    </demo-section>

    <demo-section title="Cascader 级联选择器" description="多级联动选择">
      <demo-block title="基础用法"><w-cascader v-model="form.cascader" :options="cascaderOptions" placeholder="选择地址" /></demo-block>
    </demo-section>

    <demo-section title="Checkbox 多选框" description="多项选择">
      <demo-block title="基础用法">
        <w-checkbox v-model="form.checkbox" label="A">选项A</w-checkbox>
        <w-checkbox v-model="form.checkbox" label="B">选项B</w-checkbox>
        <w-checkbox v-model="form.checkbox" label="C">选项C</w-checkbox>
      </demo-block>
      <demo-block title="禁用"><w-checkbox v-model="form.checkbox" label="D" disabled>禁用选项</w-checkbox></demo-block>
      <demo-block title="半选状态"><w-checkbox :indeterminate="true">半选</w-checkbox></demo-block>
    </demo-section>

    <demo-section title="Color Picker 颜色选择器" description="颜色拾取">
      <demo-block title="基础用法"><w-color-picker v-model="form.color" /></demo-block>
      <demo-block title="颜色面板"><w-color-picker-panel @change="val => message('选择颜色: ' + val)" /></demo-block>
    </demo-section>

    <demo-section title="Date Picker 日期选择器" description="日期选择">
      <demo-block title="基础用法"><w-date-picker v-model="form.date" /></demo-block>
      <demo-block title="日期面板"><w-date-picker-panel v-model="form.date2" /></demo-block>
    </demo-section>

    <demo-section title="DateTime Picker 日期时间选择器" description="日期和时间联动选择">
      <demo-block title="基础用法"><w-date-time-picker v-model="form.datetime" /></demo-block>
    </demo-section>

    <demo-section title="Radio 单选框" description="单项选择">
      <demo-block title="基础用法">
        <w-radio v-model="form.radio" label="A">选项A</w-radio>
        <w-radio v-model="form.radio" label="B">选项B</w-radio>
        <w-radio v-model="form.radio" label="C">选项C</w-radio>
      </demo-block>
      <demo-block title="禁用"><w-radio v-model="form.radio" label="D" disabled>禁用选项</w-radio></demo-block>
    </demo-section>

    <demo-section title="Rate 评分" description="星级评分">
      <demo-block title="基础用法"><w-rate v-model="form.rate" /></demo-block>
      <demo-block title="显示分数"><w-rate v-model="form.rate" show-score /></demo-block>
      <demo-block title="禁用"><w-rate v-model="form.rate" disabled /></demo-block>
    </demo-section>

    <demo-section title="Select 选择器" description="下拉选择">
      <demo-block title="基础用法"><w-select v-model="form.select" :options="selectOptions" /></demo-block>
      <demo-block title="虚拟化选择器"><w-virtualized-select v-model="form.select" :options="selectOptions" /></demo-block>
    </demo-section>

    <demo-section title="Slider 滑块" description="数值滑块选择">
      <demo-block title="基础用法"><w-slider v-model="form.slider" /></demo-block>
      <demo-block title="显示断点"><w-slider v-model="form.slider" :step="10" show-stops /></demo-block>
      <demo-block title="范围"><w-slider v-model="form.slider" :min="0" :max="100" /></demo-block>
    </demo-section>

    <demo-section title="Switch 开关" description="布尔状态切换">
      <demo-block title="基础用法"><w-switch v-model="form.switch" /></demo-block>
      <demo-block title="文字描述"><w-switch v-model="form.switch" active-text="开" inactive-text="关" /></demo-block>
      <demo-block title="禁用"><w-switch v-model="form.switch" disabled /></demo-block>
    </demo-section>

    <demo-section title="Time Picker 时间选择器" description="时间选择">
      <demo-block title="基础用法"><w-time-picker v-model="form.time" /></demo-block>
    </demo-section>

    <demo-section title="Time Select 时间选择" description="固定间隔时间选择">
      <demo-block title="基础用法"><w-time-select v-model="form.timeselect" /></demo-block>
      <demo-block title="自定义步长"><w-time-select v-model="form.timeselect" step="01:00" /></demo-block>
    </demo-section>

    <demo-section title="Transfer 穿梭框" description="左右数据转移">
      <demo-block title="基础用法"><w-transfer v-model="form.transfer" :data="transferData" /></demo-block>
    </demo-section>

    <demo-section title="Tree Select 树形选择" description="树形结构选择">
      <demo-block title="基础用法"><w-tree-select v-model="form.treeselect" :data="treeData" /></demo-block>
    </demo-section>

    <demo-section title="Upload 上传器" description="文件上传">
      <demo-block title="单文件"><w-upload /></demo-block>
      <demo-block title="多文件"><w-upload multiple /></demo-block>
    </demo-section>

    <demo-section title="Mention 提及" description="@提及功能">
      <demo-block title="基础用法"><w-mention v-model="form.mention" :options="mentionOptions" placeholder="输入 @ 触发" /></demo-block>
    </demo-section>

    <demo-section title="Form 表单" description="表单验证与布局">
      <demo-block title="基础表单">
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
import { reactive } from 'vue'
import DemoSection from '../components/DemoSection.vue'
import DemoBlock from '../components/DemoBlock.vue'

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
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
