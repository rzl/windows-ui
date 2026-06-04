<template>
  <div class="demo-page">
    <h1 class="page-title">🧭 Navigation 导航</h1>

    <demo-section title="Breadcrumb 面包屑" description="路径导航">
      <demo-block title="基础用法"><w-breadcrumb :items="[{ label: '首页', href: '/' }, { label: '产品', href: '/product' }, { label: '详情' }]" /></demo-block>
      <demo-block title="自定义分隔符"><w-breadcrumb :items="[{ label: 'A' }, { label: 'B' }, { label: 'C' }]" separator="/" /></demo-block>
    </demo-section>

    <demo-section title="Dropdown 下拉菜单" description="下拉操作菜单">
      <demo-block title="基础用法">
        <w-dropdown :items="[{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }, { label: '选项3', value: '3', disabled: true }]" trigger-text="点击展开" @command="v => alert(v)" />
      </demo-block>
      <demo-block title="自定义触发"><w-dropdown :items="[{ label: '编辑', value: 'edit' }, { label: '删除', value: 'delete' }]"><template #trigger><w-button>更多操作</w-button></template></w-dropdown></demo-block>
    </demo-section>

    <demo-section title="Menu 菜单" description="导航菜单">
      <demo-block title="垂直菜单"><w-menu :items="[{ label: '首页', icon: 'home' }, { label: '产品', icon: 'folder', children: [{ label: '产品A' }, { label: '产品B' }] }, { label: '关于', icon: 'user' }]" /></demo-block>
      <demo-block title="水平菜单"><w-menu mode="horizontal" :items="[{ label: '首页' }, { label: '产品', children: [{ label: 'A' }, { label: 'B' }] }, { label: '关于' }]" /></demo-block>
    </demo-section>

    <demo-section title="Page Header 页头" description="页面标题区">
      <demo-block title="基础用法"><w-page-header title="页面标题" @back="alert('返回')" /></demo-block>
      <demo-block title="带操作"><w-page-header title="详情页" show-back><template #extra><w-button size="small">编辑</w-button><w-button size="small" type="primary">保存</w-button></template></w-page-header></demo-block>
    </demo-section>

    <demo-section title="Steps 步骤条" description="流程步骤">
      <demo-block title="基础用法"><w-steps :items="[{ title: '步骤1', description: '描述1' }, { title: '步骤2', description: '描述2' }, { title: '步骤3' }]" :active="1" /></demo-block>
      <demo-block title="已完成"><w-steps :items="[{ title: '提交' }, { title: '审核' }, { title: '完成' }]" :active="3" /></demo-block>
    </demo-section>

    <demo-section title="Tabs 标签页" description="内容切换">
      <demo-block title="基础用法">
        <w-tabs :tabs="[{ label: '标签1' }, { label: '标签2' }, { label: '标签3' }]">
          <template #default="{ active }"><div v-if="active === 0">内容1</div><div v-if="active === 1">内容2</div><div v-if="active === 2">内容3</div></template>
        </w-tabs>
      </demo-block>
    </demo-section>

    <demo-section title="Backtop 回到顶部" description="滚动返回顶部">
      <demo-block title="用法说明"><p>页面滚动超过 200px 后，右下角显示回到顶部按钮</p><w-backtop /></demo-block>
    </demo-section>

    <demo-section title="Anchor 锚点" description="页面内跳转">
      <demo-block title="基础用法">
        <w-anchor :links="[{ href: '#section1', title: '章节1' }, { href: '#section2', title: '章节2', level: 2 }, { href: '#section3', title: '章节3' }]" />
      </demo-block>
    </demo-section>

    <demo-section title="Affix 固钉" description="固定元素">
      <demo-block title="基础用法"><p>滚动页面时，下方元素会固定在顶部</p><w-affix :offset="0"><w-alert title="固钉提示" description="我会固定在顶部" /></w-affix></demo-block>
    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../components/DemoSection.vue'
import DemoBlock from '../components/DemoBlock.vue'
const alert = (msg: string) => window.alert(msg)
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
