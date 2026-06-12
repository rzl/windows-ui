<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('徽标数字/状态')" id="badge" doc="badge">

            <demo-block :title="t('数字徽标')" code="&lt;w-badge :value=&quot;12&quot;&gt;&lt;w-button&gt;消息&lt;/w-button&gt;&lt;/w-badge&gt;"><w-badge :value="12"><w-button>{{ t('消息') }}</w-button></w-badge></demo-block>
            <demo-block :title="t('文字徽标')" code="&lt;w-badge value=&quot;new&quot;&gt;&lt;w-button&gt;新闻&lt;/w-button&gt;&lt;/w-badge&gt;"><w-badge value="new"><w-button>{{ t('新闻') }}</w-button></w-badge></demo-block>
            <demo-block :title="t('圆点徽标')" code="&lt;w-badge is-dot&gt;&lt;w-button&gt;通知&lt;/w-button&gt;&lt;/w-badge&gt;"><w-badge is-dot><w-button>{{ t('通知') }}</w-button></w-badge></demo-block>
            <demo-block :title="t('不同类型')" code="&lt;w-space&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;primary&quot;&gt;&lt;w-button&gt;主要&lt;/w-button&gt;&lt;/w-badge&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;success&quot;&gt;&lt;w-button&gt;成功&lt;/w-button&gt;&lt;/w-badge&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;warning&quot;&gt;&lt;w-button&gt;警告&lt;/w-button&gt;&lt;/w-badge&gt;
        &lt;w-badge :value=&quot;5&quot; type=&quot;info&quot;&gt;&lt;w-button&gt;信息&lt;/w-button&gt;&lt;/w-badge&gt;
      &lt;/w-space&gt;">
              <w-space>
                <w-badge :value="5" type="primary"><w-button>{{ t('主要') }}</w-button></w-badge>
                <w-badge :value="5" type="success"><w-button>{{ t('成功') }}</w-button></w-badge>
                <w-badge :value="5" type="warning"><w-button>{{ t('警告') }}</w-button></w-badge>
                <w-badge :value="5" type="info"><w-button>{{ t('信息') }}</w-button></w-badge>
              </w-space>
            </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { reactive, ref } from 'vue'
const { t } = useI18n()

const form = reactive({ date: '', page: 1, segment: 'day' })
const showTour = ref(false)

const calendarEvents = [{ date: new Date().toISOString().slice(0, 10), title: t('今日事件') }]
const tableData = [{ name: t('张三'), age: 28, address: t('北京') }, { name: t('李四'), age: 32, address: t('上海') }, { name: t('王五'), age: 24, address: t('广州') }]
const tableColumns = [{ prop: 'name', label: t('姓名') }, { prop: 'age', label: t('年龄') }, { prop: 'address', label: t('地址') }]
const treeData = [{ label: t('节点1'), value: '1', children: [{ label: t('子节点1-1'), value: '1-1' }] }, { label: t('节点2'), value: '2' }]

const title = t('Badge 徽章')
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
