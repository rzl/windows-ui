<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('通过 JSON 字段配置动态渲染表单')" id="dynamic-form" doc="dynamic-form">

      <demo-block :title="t('基础用法')" :code="DynamicFormCode1">
        <w-dynamic-form v-model="formModel" :fields="fields" />
        <div class="demo-actions">
          <w-button type="primary" @click="handleSubmit">{{ t('提交') }}</w-button>
          <w-button @click="handleReset">{{ t('重置') }}</w-button>
        </div>
        <p class="demo-note">{{ t('当前表单值：') }}{{ JSON.stringify(formModel) }}</p>
      </demo-block>

      <demo-block :title="t('两列布局')" :code="DynamicFormCode2">
        <w-dynamic-form v-model="formModel2" :fields="fields2" :columns="2" />
      </demo-block>

      <demo-block :title="t('字段联动')" :code="DynamicFormCode3">
        <w-dynamic-form v-model="formModel3" :fields="fields3" />
        <p class="demo-note">{{ t('选择「其他」来源后，备注字段会显示') }}</p>
      </demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'

const { t } = useI18n()
const title = 'DynamicForm 动态表单'

const formModel = reactive<Record<string, any>>({})
const fields = [
  { prop: 'username', label: t('用户名'), type: 'input' as const, required: true },
  { prop: 'age', label: t('年龄'), type: 'number' as const },
  { prop: 'email', label: t('邮箱'), type: 'input' as const, inputType: 'email' },
  { prop: 'gender', label: t('性别'), type: 'select' as const, options: [{ label: t('男'), value: 1 }, { label: t('女'), value: 2 }] },
  { prop: 'status', label: t('状态'), type: 'switch' as const, activeText: t('启用'), inactiveText: t('禁用') },
  { prop: 'remark', label: t('备注'), type: 'textarea' as const, rows: 3 }
]

const formModel2 = reactive<Record<string, any>>({})
const fields2 = [
  { prop: 'name', label: t('姓名'), type: 'input' as const },
  { prop: 'phone', label: t('手机'), type: 'input' as const },
  { prop: 'city', label: t('城市'), type: 'select' as const, options: [{ label: t('北京'), value: 'bj' }, { label: t('上海'), value: 'sh' }] },
  { prop: 'date', label: t('日期'), type: 'date' as const }
]

const formModel3 = reactive<Record<string, any>>({ source: 'web' })
const fields3 = [
  { prop: 'source', label: t('来源'), type: 'select' as const, options: [{ label: t('官网'), value: 'web' }, { label: t('App'), value: 'app' }, { label: t('其他'), value: 'other' }] },
  { prop: 'remark', label: t('备注'), type: 'textarea' as const, hidden: (model: any) => model.source !== 'other' }
]

function handleSubmit() {
  alert(t('提交：') + JSON.stringify(formModel))
}

function handleReset() {
  Object.keys(formModel).forEach((k) => delete formModel[k])
}

const codeBasic = `&lt;script setup&gt;
import { reactive } from 'vue'

const formModel = reactive({})

const fields = [
  { prop: 'username', label: '用户名', type: 'input', required: true },
  { prop: 'age', label: '年龄', type: 'number' },
  { prop: 'email', label: '邮箱', type: 'input', inputType: 'email' },
  { prop: 'gender', label: '性别', type: 'select', options: [{ label: '男', value: 1 }, { label: '女', value: 2 }] },
  { prop: 'status', label: '状态', type: 'switch', activeText: '启用', inactiveText: '禁用' },
  { prop: 'remark', label: '备注', type: 'textarea', rows: 3 }
]

function handleSubmit() {
  alert(JSON.stringify(formModel))
}

function handleReset() {
  Object.keys(formModel).forEach((k) => delete formModel[k])
}
&lt;/script&gt;

&lt;template&gt;
  &lt;w-dynamic-form v-model=&quot;formModel&quot; :fields=&quot;fields&quot; /&gt;
  &lt;div style=&quot;margin-top: 16px; display: flex; gap: 8px;&quot;&gt;
    &lt;w-button type=&quot;primary&quot; @click=&quot;handleSubmit&quot;&gt;提交&lt;/w-button&gt;
    &lt;w-button @click=&quot;handleReset&quot;&gt;重置&lt;/w-button&gt;
  &lt;/div&gt;
&lt;/template&gt;`

const codeColumns = `&lt;script setup&gt;
import { reactive } from 'vue'

const formModel = reactive({})

const fields = [
  { prop: 'name', label: '姓名', type: 'input' },
  { prop: 'phone', label: '手机', type: 'input' },
  { prop: 'city', label: '城市', type: 'select', options: [{ label: '北京', value: 'bj' }, { label: '上海', value: 'sh' }] },
  { prop: 'date', label: '日期', type: 'date' }
]
&lt;/script&gt;

&lt;template&gt;
  &lt;w-dynamic-form v-model=&quot;formModel&quot; :fields=&quot;fields&quot; :columns=&quot;2&quot; /&gt;
&lt;/template&gt;`

const codeLinkage = `&lt;script setup&gt;
import { reactive } from 'vue'

const formModel = reactive({ source: 'web' })

const fields = [
  { prop: 'source', label: '来源', type: 'select', options: [{ label: '官网', value: 'web' }, { label: 'App', value: 'app' }, { label: '其他', value: 'other' }] },
  { prop: 'remark', label: '备注', type: 'textarea', hidden: (model) => model.source !== 'other' }
]
&lt;/script&gt;

&lt;template&gt;
  &lt;w-dynamic-form v-model=&quot;formModel&quot; :fields=&quot;fields&quot; /&gt;
  &lt;p&gt;选择「其他」来源后，备注字段会显示&lt;/p&gt;
&lt;/template&gt;`

const DynamicFormCode1 = codeBasic
const DynamicFormCode2 = codeColumns
const DynamicFormCode3 = codeLinkage
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-actions { margin-top: 16px; display: flex; gap: 8px; }
.demo-note { margin-top: 12px; font-size: 12px; color: #666; word-break: break-all; }
</style>
