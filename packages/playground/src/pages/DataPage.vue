<template>
  <div class="demo-page">
    <h1 class="page-title">📊 Data 数据展示</h1>

    <demo-section title="Avatar 头像" description="用户头像展示">
      <demo-block title="基础用法">
        <w-space><w-avatar alt="User" /><w-avatar icon="user" /><w-avatar src="https://via.placeholder.com/40/245edb/fff?text=U" alt="Image" /></w-space>
      </demo-block>
      <demo-block title="尺寸"><w-space><w-avatar size="small" alt="SM" /><w-avatar alt="MD" /><w-avatar size="large" alt="LG" /></w-space></demo-block>
      <demo-block title="形状"><w-space><w-avatar shape="circle" alt="圆" /><w-avatar shape="square" alt="方" /></w-space></demo-block>
      <demo-block title="自定义颜色"><w-avatar alt="AB" bg-color="#e4a010" color="#fff" /></demo-block>
    </demo-section>

    <demo-section title="Badge 徽章" description="徽标数字/状态">
      <demo-block title="数字徽标"><w-badge :value="12"><w-button>消息</w-button></w-badge></demo-block>
      <demo-block title="文字徽标"><w-badge value="new"><w-button>新闻</w-button></w-badge></demo-block>
      <demo-block title="圆点徽标"><w-badge is-dot><w-button>通知</w-button></w-badge></demo-block>
      <demo-block title="不同类型">
        <w-space>
          <w-badge :value="5" type="primary"><w-button>主要</w-button></w-badge>
          <w-badge :value="5" type="success"><w-button>成功</w-button></w-badge>
          <w-badge :value="5" type="warning"><w-button>警告</w-button></w-badge>
          <w-badge :value="5" type="info"><w-button>信息</w-button></w-badge>
        </w-space>
      </demo-block>
    </demo-section>

    <demo-section title="Calendar 日历" description="日历展示">
      <demo-block title="基础用法"><w-calendar v-model="form.date" :events="calendarEvents" /></demo-block>
    </demo-section>

    <demo-section title="Card 卡片" description="内容容器">
      <demo-block title="基础卡片"><w-card header="卡片标题"><p>卡片内容区域</p></w-card></demo-block>
      <demo-block title="悬停阴影"><w-card header="悬停卡片" hover><p>鼠标悬停查看效果</p></w-card></demo-block>
      <demo-block title="带底部"><w-card header="标题"><p>内容</p><template #footer><w-button size="small">操作</w-button></template></w-card></demo-block>
    </demo-section>

    <demo-section title="Carousel 走马灯" description="轮播图">
      <demo-block title="基础用法">
        <w-carousel :items="[{ color: '#245edb' }, { color: '#3a9e3a' }, { color: '#e4a010' }]">
          <template #default="{ item }">
            <div :style="{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
              <span style="color:#fff;font-size:20px">Slide</span>
            </div>
          </template>
        </w-carousel>
      </demo-block>
    </demo-section>

    <demo-section title="Collapse 折叠面板" description="内容折叠展开">
      <demo-block title="基础用法"><w-collapse :items="[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]" /></demo-block>
      <demo-block title="手风琴模式"><w-collapse :items="[{ title: 'A', content: '内容A' }, { title: 'B', content: '内容B' }]" accordion /></demo-block>
    </demo-section>

    <demo-section title="Descriptions 描述列表" description="键值对信息展示">
      <demo-block title="基础用法"><w-descriptions title="用户信息" :items="[{ label: '姓名', value: '张三' }, { label: '年龄', value: '28' }, { label: '地址', value: '北京市' }]" /></demo-block>
      <demo-block title="多列"><w-descriptions title="订单信息" :column="2" :items="[{ label: '订单号', value: '2024001' }, { label: '金额', value: '¥199' }, { label: '状态', value: '已完成' }, { label: '时间', value: '2024-01-01' }]" /></demo-block>
    </demo-section>

    <demo-section title="Empty 空状态" description="无数据展示">
      <demo-block title="基础用法"><w-empty /></demo-block>
      <demo-block title="自定义描述"><w-empty description="暂无搜索结果" /></demo-block>
    </demo-section>

    <demo-section title="Image 图片" description="图片展示与预览">
      <demo-block title="基础用法"><w-image src="https://via.placeholder.com/200x100/245edb/ffffff?text=Image" alt="示例" width="200" /></demo-block>
      <demo-block title="可预览"><w-image src="https://via.placeholder.com/200x100/3a9e3a/ffffff?text=Preview" alt="预览" width="200" previewable /></demo-block>
    </demo-section>

    <demo-section title="Pagination 分页" description="分页导航">
      <demo-block title="基础用法"><w-pagination v-model:current-page="form.page" :total="100" /></demo-block>
    </demo-section>

    <demo-section title="Progress 进度条" description="进度指示">
      <demo-block title="基础用法"><w-progress :percentage="30" /></demo-block>
      <demo-block title="不同状态">
        <w-space direction="vertical">
          <w-progress :percentage="100" status="success" />
          <w-progress :percentage="80" status="warning" />
          <w-progress :percentage="60" status="danger" />
        </w-space>
      </demo-block>
      <demo-block title="不显示文字"><w-progress :percentage="50" :show-text="false" /></demo-block>
    </demo-section>

    <demo-section title="Result 结果" description="操作结果反馈">
      <demo-block title="成功"><w-result icon="success" title="操作成功" subtitle="您的操作已成功完成"><template #extra><w-button type="primary">返回</w-button></template></w-result></demo-block>
      <demo-block title="警告"><w-result icon="warning" title="操作警告" subtitle="请注意潜在风险" /></demo-block>
      <demo-block title="错误"><w-result icon="error" title="操作失败" subtitle="请稍后重试" /></demo-block>
    </demo-section>

    <demo-section title="Skeleton 骨架屏" description="加载占位">
      <demo-block title="基础用法"><w-skeleton :rows="3" /></demo-block>
      <demo-block title="非加载状态"><w-skeleton :loading="false"><w-card header="内容已加载"><p>真实内容区域</p></w-card></w-skeleton></demo-block>
    </demo-section>

    <demo-section title="Table 表格" description="数据表格">
      <demo-block title="基础表格"><w-table :data="tableData" :columns="tableColumns" /></demo-block>
      <demo-block title="虚拟化表格"><w-virtualized-table :data="tableData" :columns="tableColumns" /></demo-block>
    </demo-section>

    <demo-section title="Tag 标签" description="标记与分类">
      <demo-block title="基础用法">
        <w-space><w-tag>默认</w-tag><w-tag type="primary">主要</w-tag><w-tag type="success">成功</w-tag><w-tag type="warning">警告</w-tag><w-tag type="danger">危险</w-tag><w-tag type="info">信息</w-tag></w-space>
      </demo-block>
      <demo-block title="可关闭"><w-tag closable @close="alert('关闭')">可关闭</w-tag></demo-block>
      <demo-block title="尺寸"><w-space><w-tag size="small">小</w-tag><w-tag>中</w-tag><w-tag size="large">大</w-tag></w-space></demo-block>
    </demo-section>

    <demo-section title="Timeline 时间线" description="时间轴展示">
      <demo-block title="基础用法"><w-timeline :items="[{ time: '2024-01', title: '开始' }, { time: '2024-02', title: '开发', content: '核心功能', color: '#245edb' }, { time: '2024-03', title: '上线' }]" /></demo-block>
    </demo-section>

    <demo-section title="Tree 树形控件" description="层级数据展示">
      <demo-block title="基础用法"><w-tree :data="treeData" /></demo-block>
      <demo-block title="默认展开"><w-tree :data="treeData" expand-all /></demo-block>
      <demo-block title="虚拟化树"><w-virtualized-tree :data="treeData" /></demo-block>
    </demo-section>

    <demo-section title="Statistic 统计组件" description="数值展示">
      <demo-block title="基础用法"><w-space><w-statistic title="用户总数" :value="12345" suffix="人" /><w-statistic title="增长率" :value="12.5" suffix="%" :precision="1" /></w-space></demo-block>
      <demo-block title="自定义样式"><w-statistic title="销售额" :value="888888" prefix="¥" :value-style="{ color: '#d92b2b' }" /></demo-block>
    </demo-section>

    <demo-section title="Segmented 分段控制器" description="分段选项">
      <demo-block title="基础用法"><w-segmented v-model="form.segment" :options="[{ label: '日', value: 'day' }, { label: '周', value: 'week' }, { label: '月', value: 'month' }]" /></demo-block>
      <demo-block title="带图标"><w-segmented v-model="form.segment" :options="[{ label: '列表', value: 'list', icon: 'menu' }, { label: '网格', value: 'grid', icon: 'folder' }]" /></demo-block>
    </demo-section>

    <demo-section title="Tour 漫游式引导" description="新用户引导">
      <demo-block title="基础用法">
        <w-button @click="showTour = true">开始漫游</w-button>
        <w-tour v-model="showTour" :steps="[{ title: '欢迎', description: '欢迎使用 Windows UI' }, { title: '功能介绍', description: '这里展示各种组件' }]" />
      </demo-block>
    </demo-section>

    <demo-section title="Infinite Scroll 无限滚动" description="滚动加载更多">
      <demo-block title="基础用法">
        <w-infinite-scroll :loading="false" :no-more="true">
          <div v-for="i in 5" :key="i" style="padding:8px;border-bottom:1px solid #e0e0e0">项目 {{ i }}</div>
        </w-infinite-scroll>
      </demo-block>
    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import DemoSection from '../components/DemoSection.vue'
import DemoBlock from '../components/DemoBlock.vue'

const form = reactive({ date: '', page: 1, segment: 'day' })
const showTour = ref(false)

const calendarEvents = [{ date: new Date().toISOString().slice(0, 10), title: '今日事件' }]
const tableData = [{ name: '张三', age: 28, address: '北京' }, { name: '李四', age: 32, address: '上海' }, { name: '王五', age: 24, address: '广州' }]
const tableColumns = [{ prop: 'name', label: '姓名' }, { prop: 'age', label: '年龄' }, { prop: 'address', label: '地址' }]
const treeData = [{ label: '节点1', value: '1', children: [{ label: '子节点1-1', value: '1-1' }] }, { label: '节点2', value: '2' }]
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>
