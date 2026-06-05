<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="一次性密码输入" id="input-otp" doc="input-otp">

      <demo-block title="6位验证码" code="&lt;w-input-otp v-model=&quot;form.otp&quot; :length=&quot;6&quot; /&gt;"><w-input-otp v-model="form.otp" :length="6" /></demo-block>
      <demo-block title="4位验证码" code="&lt;w-input-otp v-model=&quot;form.otp2&quot; :length=&quot;4&quot; /&gt;"><w-input-otp v-model="form.otp2" :length="4" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Input OTP 验证码'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
