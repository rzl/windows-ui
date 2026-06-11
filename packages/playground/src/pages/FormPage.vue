<template>
  <div class="demo-page">
    <h1 class="page-title">表单组件</h1>
    <div class="component-grid">
      <router-link to="/form/input" class="component-card">
        <h3>Input 输入框</h3>
        <p>基础文本输入</p>
      </router-link>
      <router-link to="/form/input-number" class="component-card">
        <h3>Input Number 数字输入框</h3>
        <p>数字输入与步进控制</p>
      </router-link>
      <router-link to="/form/input-tag" class="component-card">
        <h3>Input Tag 标签输入框</h3>
        <p>输入生成标签</p>
      </router-link>
      <router-link to="/form/input-otp" class="component-card">
        <h3>Input OTP 验证码</h3>
        <p>一次性密码输入</p>
      </router-link>
      <router-link to="/form/autocomplete" class="component-card">
        <h3>Autocomplete 自动补全</h3>
        <p>输入联想补全</p>
      </router-link>
      <router-link to="/form/cascader" class="component-card">
        <h3>Cascader 级联选择器</h3>
        <p>多级联动选择</p>
      </router-link>
      <router-link to="/form/checkbox" class="component-card">
        <h3>Checkbox 多选框</h3>
        <p>多项选择</p>
      </router-link>
      <router-link to="/form/color-picker" class="component-card">
        <h3>Color Picker 颜色选择器</h3>
        <p>颜色拾取</p>
      </router-link>
      <router-link to="/form/date-picker" class="component-card">
        <h3>Date Picker 日期选择器</h3>
        <p>日期选择</p>
      </router-link>
      <router-link to="/form/datetime-picker" class="component-card">
        <h3>DateTime Picker 日期时间选择器</h3>
        <p>日期和时间联动选择</p>
      </router-link>
      <router-link to="/form/radio" class="component-card">
        <h3>Radio 单选框</h3>
        <p>单项选择</p>
      </router-link>
      <router-link to="/form/rate" class="component-card">
        <h3>Rate 评分</h3>
        <p>星级评分</p>
      </router-link>
      <router-link to="/form/select" class="component-card">
        <h3>Select 选择器</h3>
        <p>下拉选择</p>
      </router-link>
      <router-link to="/form/slider" class="component-card">
        <h3>Slider 滑块</h3>
        <p>数值滑块选择</p>
      </router-link>
      <router-link to="/form/switch" class="component-card">
        <h3>Switch 开关</h3>
        <p>布尔状态切换</p>
      </router-link>
      <router-link to="/form/time-picker" class="component-card">
        <h3>Time Picker 时间选择器</h3>
        <p>时间选择</p>
      </router-link>
      <router-link to="/form/time-select" class="component-card">
        <h3>Time Select 时间选择</h3>
        <p>固定间隔时间选择</p>
      </router-link>
      <router-link to="/form/transfer" class="component-card">
        <h3>Transfer 穿梭框</h3>
        <p>左右数据转移</p>
      </router-link>
      <router-link to="/form/tree-select" class="component-card">
        <h3>Tree Select 树形选择</h3>
        <p>树形结构选择</p>
      </router-link>
      <router-link to="/form/upload" class="component-card">
        <h3>Upload 上传器</h3>
        <p>文件上传</p>
      </router-link>
      <router-link to="/form/mention" class="component-card">
        <h3>Mention 提及</h3>
        <p>@提及功能</p>
      </router-link>
      <router-link to="/form/form" class="component-card">
        <h3>Form 表单</h3>
        <p>表单验证与布局</p>
      </router-link>
      <router-link to="/form/search-form" class="component-card">
        <h3>SearchForm 搜索表单</h3>
        <p>带查询和重置的搜索表单</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.component-card { display: block; background: #fff; border: 2px solid; border-color: #fff #808080 #808080 #fff; padding: 16px; text-decoration: none; color: inherit; transition: transform .1s; }
.component-card:hover { transform: translateY(-2px); background: #f8f8f8; }
.component-card h3 { margin: 0 0 8px; font-size: 16px; color: #245edb; }
.component-card p { margin: 0; font-size: 12px; color: #666; }
</style>
