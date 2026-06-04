<template>
  <div class="home-page">
    <w-card header="欢迎使用 Windows UI" shadow="always">
      <w-typography>
        <h2>🖥️ Windows UI - Vue 3 UI 组件库</h2>
        <p>这是一个受 <strong>Windows XP</strong> 经典风格启发的 Vue 3 UI 组件库。</p>
        <h3>✨ 特性</h3>
        <ul>
          <li>Windows XP 经典视觉风格</li>
          <li>可自定义组件前缀（默认 <code>w-</code>）</li>
          <li>82+ 个组件，覆盖基础、表单、数据展示、导航、反馈等场景</li>
          <li>CSS 变量主题系统，易于修改主题色</li>
          <li>TypeScript 支持</li>
        </ul>
        <h3>📦 安装</h3>
        <code>npm install @windows-ui/core</code>
        <h3>🔧 快速开始</h3>
        <code>import WindowsUI from '@windows-ui/core'</code>
        <br />
        <code>app.use(WindowsUI)</code>
      </w-typography>
    </w-card>

    <w-divider />

    <h2 class="section-title">组件概览</h2>
    <div class="overview-grid">
      <w-card v-for="group in groups" :key="group.name" :header="group.name" class="overview-card">
        <w-space wrap>
          <w-tag v-for="c in group.components" :key="c" type="info" size="small">{{ c }}</w-tag>
        </w-space>
      </w-card>
    </div>
  </div>
</template>

<script setup lang="ts">
const groups = [
  { name: '基础组件 (12)', components: ['Button','Border','Color','Container','Icon','Layout','Link','Text','Scrollbar','Space','Splitter','Typography'] },
  { name: '配置组件 (1)', components: ['ConfigProvider'] },
  { name: '表单组件 (22)', components: ['Autocomplete','Cascader','Checkbox','ColorPicker','DatePicker','DateTimePicker','Form','Input','InputNumber','InputTag','InputOTP','Mention','Radio','Rate','Select','Slider','Switch','TimePicker','TimeSelect','Transfer','TreeSelect','Upload'] },
  { name: '数据展示 (22)', components: ['Avatar','Badge','Calendar','Card','Carousel','Collapse','Descriptions','Empty','Image','InfiniteScroll','Pagination','Progress','Result','Skeleton','Table','Tag','Timeline','Tour','Tree','Statistic','Segmented'] },
  { name: '导航组件 (9)', components: ['Affix','Anchor','Backtop','Breadcrumb','Dropdown','Menu','PageHeader','Steps','Tabs'] },
  { name: '反馈组件 (10)', components: ['Alert','Dialog','Drawer','Loading','Message','MessageBox','Notification','Popconfirm','Popover','Tooltip'] },
  { name: '其他组件 (2)', components: ['Divider','Watermark'] },
]
</script>

<style scoped>
.home-page { padding: 8px; }
.section-title { font-size: 20px; color: #245edb; margin: 20px 0 12px; }
.overview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.overview-card { margin-bottom: 0; }
</style>
