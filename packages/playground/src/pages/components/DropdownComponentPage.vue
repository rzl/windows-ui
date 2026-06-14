<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('下拉操作菜单')" id="dropdown" doc="dropdown">

      <demo-block :title="t('基础用法')" :code="DropdownCode1">
        <w-dropdown :items="[{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }, { label: '选项3', value: '3', disabled: true }]" trigger-text="点击展开" @command="(v: string) => alert(v)" />
      </demo-block>
      <demo-block :title="t('自定义触发')" :code="DropdownCode2"><w-dropdown :items="[{ label: '编辑', value: 'edit' }, { label: '删除', value: 'delete' }]"><template #trigger><w-button>{{ t('更多操作') }}</w-button></template></w-dropdown></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
const { t } = useI18n()

const alert = (msg: string) => window.alert(msg)

const title = t('Dropdown 下拉菜单')

const DropdownCode1 = `<w-dropdown :items="[{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }, { label: '选项3', value: '3', disabled: true }]" trigger-text="点击展开" @command="v => alert(v)" />`
const DropdownCode2 = `<w-dropdown :items="[{ label: '编辑', value: 'edit' }, { label: '删除', value: 'delete' }]"><template #trigger><w-button>更多操作</w-button></template></w-dropdown>`
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
