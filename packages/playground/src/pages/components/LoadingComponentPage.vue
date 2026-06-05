<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="加载状态覆盖" id="loading" doc="loading">

      <demo-block title="基础加载" code="&lt;div style=&quot;position:relative;height:80px;border:1px solid #d4d0c8&quot;&gt;&lt;w-loading :visible=&quot;true&quot; text=&quot;加载中...&quot; /&gt;&lt;/div&gt;"><div style="position:relative;height:80px;border:1px solid #d4d0c8"><w-loading :visible="true" text="加载中..." /></div></demo-block>
      <demo-block title="无文字加载" code="&lt;div style=&quot;position:relative;height:80px;border:1px solid #d4d0c8&quot;&gt;&lt;w-loading :visible=&quot;true&quot; /&gt;&lt;/div&gt;"><div style="position:relative;height:80px;border:1px solid #d4d0c8"><w-loading :visible="true" /></div></demo-block>
      <demo-block title="表格加载" code="&lt;div style=&quot;position:relative;border:1px solid #d4d0c8&quot;&gt;&lt;w-table :data=&quot;[]&quot; :columns=&quot;[{prop:'a',label:'A'}]&quot; /&gt;&lt;w-loading :visible=&quot;true&quot; text=&quot;数据加载中...&quot; /&gt;&lt;/div&gt;"><div style="position:relative;border:1px solid #d4d0c8"><w-table :data="[]" :columns="[{prop:'a',label:'A'}]" /><w-loading :visible="true" text="数据加载中..." /></div></demo-block>
      <demo-block title="内容区域加载" code="&lt;div style=&quot;position:relative;height:120px;border:1px solid #d4d0c8;padding:12px&quot;&gt;&lt;p&gt;底层内容&lt;/p&gt;&lt;w-loading :visible=&quot;true&quot; text=&quot;正在保存...&quot; /&gt;&lt;/div&gt;"><div style="position:relative;height:120px;border:1px solid #d4d0c8;padding:12px"><p>底层内容</p><w-loading :visible="true" text="正在保存..." /></div></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const title = 'Loading 加载'
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
