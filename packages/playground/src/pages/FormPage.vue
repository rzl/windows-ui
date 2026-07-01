<template>
  <div class="demo-page">
    <h1 class="page-title">{{ t('表单组件') }}</h1>
    <div class="component-grid">
      <router-link to="/form/input" class="component-card">
        <h3>Input 输入框</h3>
        <p>{{ t('基础文本输入') }}</p>
      </router-link>
      <router-link to="/form/input-number" class="component-card">
        <h3>Input Number 数字输入框</h3>
        <p>{{ t('数字输入与步进控制') }}</p>
      </router-link>
      <router-link to="/form/input-tag" class="component-card">
        <h3>Input Tag 标签输入框</h3>
        <p>{{ t('输入生成标签') }}</p>
      </router-link>
      <router-link to="/form/input-otp" class="component-card">
        <h3>Input OTP 验证码</h3>
        <p>{{ t('一次性密码输入') }}</p>
      </router-link>
      <router-link to="/form/autocomplete" class="component-card">
        <h3>Autocomplete 自动补全</h3>
        <p>{{ t('输入联想补全') }}</p>
      </router-link>
      <router-link to="/form/cascader" class="component-card">
        <h3>Cascader 级联选择器</h3>
        <p>{{ t('多级联动选择') }}</p>
      </router-link>
      <router-link to="/form/checkbox" class="component-card">
        <h3>Checkbox 多选框</h3>
        <p>{{ t('多项选择') }}</p>
      </router-link>
      <router-link to="/form/color-picker" class="component-card">
        <h3>Color Picker 颜色选择器</h3>
        <p>{{ t('颜色拾取') }}</p>
      </router-link>
      <router-link to="/form/color-picker-panel" class="component-card">
        <h3>ColorPickerPanel 颜色面板</h3>
        <p>{{ t('独立颜色选择面板') }}</p>
      </router-link>
      <router-link to="/form/date-picker" class="component-card">
        <h3>Date Picker 日期选择器</h3>
        <p>{{ t('日期选择') }}</p>
      </router-link>
      <router-link to="/form/date-picker-panel" class="component-card">
        <h3>DatePickerPanel 日期面板</h3>
        <p>{{ t('独立日期选择面板') }}</p>
      </router-link>
      <router-link to="/form/datetime-picker" class="component-card">
        <h3>DateTime Picker 日期时间选择器</h3>
        <p>{{ t('日期和时间联动选择') }}</p>
      </router-link>
      <router-link to="/form/radio" class="component-card">
        <h3>Radio 单选框</h3>
        <p>{{ t('单项选择') }}</p>
      </router-link>
      <router-link to="/form/rate" class="component-card">
        <h3>Rate 评分</h3>
        <p>{{ t('星级评分') }}</p>
      </router-link>
      <router-link to="/form/select" class="component-card">
        <h3>Select 选择器</h3>
        <p>{{ t('下拉选择') }}</p>
      </router-link>
      <router-link to="/form/virtualized-select" class="component-card">
        <h3>VirtualizedSelect 虚拟化选择器</h3>
        <p>{{ t('海量选项下拉选择') }}</p>
      </router-link>
      <router-link to="/form/slider" class="component-card">
        <h3>Slider 滑块</h3>
        <p>{{ t('数值滑块选择') }}</p>
      </router-link>
      <router-link to="/form/switch" class="component-card">
        <h3>Switch 开关</h3>
        <p>{{ t('布尔状态切换') }}</p>
      </router-link>
      <router-link to="/form/time-picker" class="component-card">
        <h3>Time Picker 时间选择器</h3>
        <p>{{ t('时间选择') }}</p>
      </router-link>
      <router-link to="/form/time-select" class="component-card">
        <h3>Time Select 时间选择</h3>
        <p>{{ t('固定间隔时间选择') }}</p>
      </router-link>
      <router-link to="/form/transfer" class="component-card">
        <h3>Transfer 穿梭框</h3>
        <p>{{ t('左右数据转移') }}</p>
      </router-link>
      <router-link to="/form/tree-select" class="component-card">
        <h3>Tree Select 树形选择</h3>
        <p>{{ t('树形结构选择') }}</p>
      </router-link>
      <router-link to="/form/upload" class="component-card">
        <h3>Upload 上传器</h3>
        <p>{{ t('文件上传') }}</p>
      </router-link>
      <router-link to="/form/rich-text" class="component-card">
        <h3>RichText 富文本</h3>
        <p>{{ t('轻量富文本编辑器') }}</p>
      </router-link>
      <router-link to="/form/monaco-editor" class="component-card">
        <h3>Monaco Editor 在线编辑器</h3>
        <p>{{ t('在线代码编辑器') }}</p>
      </router-link>
      <router-link to="/form/mention" class="component-card">
        <h3>Mention 提及</h3>
        <p>{{ t('@ 提及功能') }}</p>
      </router-link>
      <router-link to="/form/form" class="component-card">
        <h3>Form 表单</h3>
        <p>{{ t('表单验证与布局') }}</p>
      </router-link>
      <router-link to="/form/search-form" class="component-card">
        <h3>SearchForm 搜索表单</h3>
        <p>{{ t('带查询和重置的搜索表单') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.page-title { font-size: 24px; color: var(--w-color-primary); margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid var(--w-border-color); }
.component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.component-card { display: block; background: var(--w-bg-color); border: 2px solid; border-color: var(--w-border-color-light) var(--w-border-color-dark) var(--w-border-color-dark) var(--w-border-color-light); padding: 16px; text-decoration: none; color: inherit; transition: transform .1s; }
.component-card:hover { transform: translateY(-2px); background: var(--w-fill-color); }
.component-card h3 { margin: 0 0 8px; font-size: 16px; color: var(--w-color-primary); }
.component-card p { margin: 0; font-size: 12px; color: var(--w-text-color-secondary); }
</style>
