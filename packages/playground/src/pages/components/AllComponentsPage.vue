<template>
  <div class="demo-page all-components-page">
    <h1 class="page-title">全部组件一览</h1>
    <p class="page-desc">
      本页面使用 <code>w-form</code> 组织所有组件，按六大分类展示每个组件的默认状态，共覆盖 80+ 个独立组件。
    </p>

    <w-form class="all-form">
      <!-- ========== 🔧 基础组件 ========== -->
      <w-card header="🔧 基础组件" class="category-card">
        <div class="component-grid">
          <w-form-item label="Button 按钮">
            <w-button>默认按钮</w-button>
          </w-form-item>

          <w-form-item label="Border 边框">
            <w-space>
              <w-border type="raised" style="padding:8px 12px">凸起</w-border>
              <w-border type="sunken" style="padding:8px 12px">凹陷</w-border>
              <w-border type="field" style="padding:8px 12px">字段</w-border>
            </w-space>
          </w-form-item>

          <w-form-item label="Color 色彩">
            <w-color />
          </w-form-item>

          <w-form-item label="Container 布局容器">
            <w-container style="padding:8px;background:#f5f5f5;border:1px solid #d4d0c8">
              容器内容
            </w-container>
          </w-form-item>

          <w-form-item label="Icon 图标">
            <w-space>
              <w-icon name="home" />
              <w-icon name="search" />
              <w-icon name="user" />
            </w-space>
          </w-form-item>

          <w-form-item label="Layout 布局">
            <w-layout direction="horizontal">
              <w-button size="small">左</w-button>
              <w-button size="small">右</w-button>
            </w-layout>
          </w-form-item>

          <w-form-item label="Link 链接">
            <w-link>默认链接</w-link>
          </w-form-item>

          <w-form-item label="Text 文本">
            <w-text>默认文本</w-text>
          </w-form-item>

          <w-form-item label="Scrollbar 滚动条">
            <w-scrollbar height="60px">
              <p v-for="i in 5" :key="i">滚动内容 {{ i }}</p>
            </w-scrollbar>
          </w-form-item>

          <w-form-item label="Space 间距">
            <w-space>
              <w-tag size="small">A</w-tag>
              <w-tag size="small">B</w-tag>
              <w-tag size="small">C</w-tag>
            </w-space>
          </w-form-item>

          <w-form-item label="Splitter 分隔面板">
            <w-splitter :split="50" style="height:80px">
              <template #first><div style="padding:4px">左</div></template>
              <template #second><div style="padding:4px">右</div></template>
            </w-splitter>
          </w-form-item>

          <w-form-item label="Typography 排版">
            <w-typography>
              <h4 style="margin:0">标题</h4>
              <p style="margin:0">正文内容</p>
            </w-typography>
          </w-form-item>

          <w-form-item label="ConfigProvider 全局配置">
            <w-config-provider size="small">
              <w-button size="small">小号按钮</w-button>
            </w-config-provider>
          </w-form-item>

          <w-form-item label="AdminLayout 后台布局">
            <div style="height:120px;overflow:hidden;border:1px solid #d4d0c8">
              <w-admin-layout title="演示系统">
                <template #menu><w-menu :items="[{label:'首页'}]" /></template>
                <template #header><span>顶部栏</span></template>
                <div style="padding:8px">内容区</div>
              </w-admin-layout>
            </div>
          </w-form-item>
        </div>
      </w-card>

      <!-- ========== 📝 表单组件 ========== -->
      <w-card header="📝 表单组件" class="category-card">
        <div class="component-grid">
          <w-form-item label="Input 输入框">
            <w-input v-model="form.input" placeholder="请输入" />
          </w-form-item>

          <w-form-item label="InputNumber 数字输入框">
            <w-input-number v-model="form.number" :min="0" :max="100" />
          </w-form-item>

          <w-form-item label="InputTag 标签输入框">
            <w-input-tag v-model="form.tags" placeholder="输入后按回车" />
          </w-form-item>

          <w-form-item label="InputOTP 验证码">
            <w-input-otp v-model="form.otp" :length="4" />
          </w-form-item>

          <w-form-item label="Autocomplete 自动补全">
            <w-autocomplete v-model="form.auto" :options="autocompleteOptions" placeholder="输入水果名称" />
          </w-form-item>

          <w-form-item label="Cascader 级联选择器">
            <w-cascader v-model="form.cascader" :options="cascaderOptions" placeholder="选择地址" />
          </w-form-item>

          <w-form-item label="Checkbox 多选框">
            <w-checkbox v-model="form.checkbox" label="A">选项A</w-checkbox>
            <w-checkbox v-model="form.checkbox" label="B">选项B</w-checkbox>
          </w-form-item>

          <w-form-item label="ColorPicker 颜色选择器">
            <w-color-picker v-model="form.color" />
          </w-form-item>

          <w-form-item label="DatePicker 日期选择器">
            <w-date-picker v-model="form.date" />
          </w-form-item>

          <w-form-item label="DateTimePicker 日期时间选择器">
            <w-date-time-picker v-model="form.datetime" />
          </w-form-item>

          <w-form-item label="Radio 单选框">
            <w-radio v-model="form.radio" label="A">选项A</w-radio>
            <w-radio v-model="form.radio" label="B">选项B</w-radio>
          </w-form-item>

          <w-form-item label="Rate 评分">
            <w-rate v-model="form.rate" />
          </w-form-item>

          <w-form-item label="Select 选择器">
            <w-select v-model="form.select" :options="selectOptions" />
          </w-form-item>

          <w-form-item label="Slider 滑块">
            <w-slider v-model="form.slider" />
          </w-form-item>

          <w-form-item label="Switch 开关">
            <w-switch v-model="form.switch" />
          </w-form-item>

          <w-form-item label="TimePicker 时间选择器">
            <w-time-picker v-model="form.time" />
          </w-form-item>

          <w-form-item label="TimeSelect 时间选择">
            <w-time-select v-model="form.timeselect" />
          </w-form-item>

          <w-form-item label="Transfer 穿梭框">
            <w-transfer v-model="form.transfer" :data="transferData" />
          </w-form-item>

          <w-form-item label="TreeSelect 树形选择">
            <w-tree-select v-model="form.treeselect" :data="treeData" />
          </w-form-item>

          <w-form-item label="Upload 上传器">
            <w-upload />
          </w-form-item>

          <w-form-item label="Mention 提及">
            <w-mention v-model="form.mention" :options="mentionOptions" placeholder="输入 @ 触发" />
          </w-form-item>

          <w-form-item label="SearchForm 搜索表单">
            <w-search-form :model="searchModel" @search="onSearch" @reset="onReset">
              <w-form-item label="名称"><w-input v-model="searchModel.name" /></w-form-item>
              <w-form-item label="状态"><w-select v-model="searchModel.status" :options="statusOptions" /></w-form-item>
            </w-search-form>
          </w-form-item>
        </div>
      </w-card>

      <!-- ========== 📊 数据展示 ========== -->
      <w-card header="📊 数据展示" class="category-card">
        <div class="component-grid">
          <w-form-item label="Avatar 头像">
            <w-space>
              <w-avatar alt="User" />
              <w-avatar icon="user" />
            </w-space>
          </w-form-item>

          <w-form-item label="Badge 徽章">
            <w-badge :value="5">
              <w-button size="small">消息</w-button>
            </w-badge>
          </w-form-item>

          <w-form-item label="Calendar 日历">
            <w-calendar v-model="form.calDate" :events="calendarEvents" />
          </w-form-item>

          <w-form-item label="Card 卡片">
            <w-card header="卡片标题" style="max-width:240px">
              <p style="margin:0">卡片内容</p>
            </w-card>
          </w-form-item>

          <w-form-item label="Carousel 走马灯">
            <w-carousel :items="[{ color: '#245edb' }, { color: '#3a9e3a' }]">
              <template #default="{ item }">
                <div :style="{ background: item.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                  <span style="color:#fff">Slide</span>
                </div>
              </template>
            </w-carousel>
          </w-form-item>

          <w-form-item label="Collapse 折叠面板">
            <w-collapse :items="[{ title: '标题1', content: '内容1' }, { title: '标题2', content: '内容2' }]" />
          </w-form-item>

          <w-form-item label="Descriptions 描述列表">
            <w-descriptions title="用户信息" :items="[{ label: '姓名', value: '张三' }, { label: '年龄', value: '28' }]" />
          </w-form-item>

          <w-form-item label="Empty 空状态">
            <w-empty />
          </w-form-item>

          <w-form-item label="Image 图片">
            <w-image src="https://via.placeholder.com/120x60/245edb/ffffff?text=Image" alt="示例" width="120" />
          </w-form-item>

          <w-form-item label="Pagination 分页">
            <w-pagination v-model:current-page="form.page" :total="100" />
          </w-form-item>

          <w-form-item label="Progress 进度条">
            <w-progress :percentage="50" />
          </w-form-item>

          <w-form-item label="Result 结果">
            <w-result icon="success" title="操作成功" subtitle="您的操作已成功完成" />
          </w-form-item>

          <w-form-item label="Skeleton 骨架屏">
            <w-skeleton :rows="2" />
          </w-form-item>

          <w-form-item label="Table 表格">
            <w-table :data="tableData" :columns="tableColumns" />
          </w-form-item>

          <w-form-item label="Tag 标签">
            <w-space>
              <w-tag>默认</w-tag>
              <w-tag type="primary">主要</w-tag>
            </w-space>
          </w-form-item>

          <w-form-item label="Timeline 时间线">
            <w-timeline :items="[{ time: '2024-01', title: '开始' }, { time: '2024-02', title: '上线' }]" />
          </w-form-item>

          <w-form-item label="Tree 树形控件">
            <w-tree :data="treeData" />
          </w-form-item>

          <w-form-item label="Statistic 统计组件">
            <w-statistic title="用户总数" :value="12345" suffix="人" />
          </w-form-item>

          <w-form-item label="Segmented 分段控制器">
            <w-segmented v-model="form.segment" :options="[{ label: '日', value: 'day' }, { label: '周', value: 'week' }]" />
          </w-form-item>

          <w-form-item label="Tour 漫游式引导">
            <w-button size="small" @click="showTour = true">开始漫游</w-button>
            <w-tour v-model:visible="showTour" :steps="[{ title: '欢迎', description: '欢迎使用 Windows UI' }]" />
          </w-form-item>

          <w-form-item label="Infinite Scroll 无限滚动">
            <w-infinite-scroll :loading="false" :no-more="true" style="max-height:80px;overflow:auto">
              <div v-for="i in 3" :key="i" style="padding:4px;border-bottom:1px solid #e0e0e0">项目 {{ i }}</div>
            </w-infinite-scroll>
          </w-form-item>
        </div>
      </w-card>

      <!-- ========== 🧭 导航组件 ========== -->
      <w-card header="🧭 导航组件" class="category-card">
        <div class="component-grid">
          <w-form-item label="Breadcrumb 面包屑">
            <w-breadcrumb :items="[{ label: '首页', href: '/' }, { label: '详情' }]" />
          </w-form-item>

          <w-form-item label="Dropdown 下拉菜单">
            <w-dropdown :items="[{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }]" trigger-text="点击展开" />
          </w-form-item>

          <w-form-item label="Menu 菜单">
            <w-menu :items="[{ label: '首页', icon: 'home' }, { label: '产品', icon: 'folder' }]" />
          </w-form-item>

          <w-form-item label="PageHeader 页头">
            <w-page-header title="页面标题" @back="alert('返回')" />
          </w-form-item>

          <w-form-item label="Steps 步骤条">
            <w-steps :items="[{ title: '提交', description: '填写信息' }, { title: '审核' }, { title: '完成' }]" :active="1" />
          </w-form-item>

          <w-form-item label="Tabs 标签页">
            <w-tabs :tabs="[{ label: '标签1' }, { label: '标签2' }]">
              <template #default="{ active }">
                <div v-if="active === 0">内容1</div>
                <div v-if="active === 1">内容2</div>
              </template>
            </w-tabs>
          </w-form-item>

          <w-form-item label="Backtop 回到顶部">
            <p style="margin:0">页面滚动后右下角显示</p>
            <w-backtop />
          </w-form-item>

          <w-form-item label="Anchor 锚点">
            <w-anchor :links="[{ href: '#basic', title: '基础' }, { href: '#form', title: '表单' }]" />
          </w-form-item>

          <w-form-item label="Affix 固钉">
            <w-affix :offset="0">
              <w-alert title="固钉提示" description="滚动时固定在顶部" />
            </w-affix>
          </w-form-item>
        </div>
      </w-card>

      <!-- ========== 💬 反馈组件 ========== -->
      <w-card header="💬 反馈组件" class="category-card">
        <div class="component-grid">
          <w-form-item label="Alert 提示">
            <w-alert title="信息提示" description="这是一条普通信息消息" type="info" />
          </w-form-item>

          <w-form-item label="Dialog 对话框">
            <w-button size="small" @click="dialogs.basic = true">打开对话框</w-button>
            <w-dialog v-model="dialogs.basic" title="系统提示">
              <p>您确定要执行此操作吗？</p>
              <template #footer>
                <w-button @click="dialogs.basic = false">取消</w-button>
                <w-button type="primary" @click="dialogs.basic = false">确定</w-button>
              </template>
            </w-dialog>
          </w-form-item>

          <w-form-item label="Drawer 抽屉">
            <w-button size="small" @click="drawers.right = true">打开抽屉</w-button>
            <w-drawer v-model="drawers.right" title="设置">
              <p>抽屉内容区域</p>
            </w-drawer>
          </w-form-item>

          <w-form-item label="Loading 加载">
            <div style="position:relative;height:60px;border:1px solid #d4d0c8">
              <w-loading :visible="true" text="加载中..." />
            </div>
          </w-form-item>

          <w-form-item label="Message 消息提示">
            <w-space>
              <w-button size="small" @click="msgRef?.info('这是一条信息消息')">信息</w-button>
              <w-button size="small" @click="msgRef?.success('操作成功！')">成功</w-button>
            </w-space>
            <w-message ref="msgRef" />
          </w-form-item>

          <w-form-item label="Notification 通知">
            <w-space>
              <w-button size="small" @click="notifyRef?.show({ message: '系统将于今晚维护', type: 'info' })">信息</w-button>
              <w-button size="small" @click="notifyRef?.show({ message: '文件上传成功', type: 'success' })">成功</w-button>
            </w-space>
            <w-notification ref="notifyRef" />
          </w-form-item>

          <w-form-item label="Popconfirm 气泡确认框">
            <w-popconfirm title="确认删除？" @confirm="alert('已删除')">
              <w-button type="danger" size="small">删除</w-button>
            </w-popconfirm>
          </w-form-item>

          <w-form-item label="Popover 弹出框">
            <w-popover title="用户信息" content="这是用户详细信息面板">
              <w-button size="small">查看用户</w-button>
            </w-popover>
          </w-form-item>

          <w-form-item label="Tooltip 文字提示">
            <w-tooltip content="提示文字">
              <w-button size="small">悬停查看</w-button>
            </w-tooltip>
          </w-form-item>

          <w-form-item label="MessageBox 消息弹出框">
            <w-space>
              <w-button size="small" @click="msgBoxRef?.open({ message: '确认删除此文件？' })">确认框</w-button>
              <w-button size="small" @click="msgBoxRef?.open({ message: '操作成功！', type: 'success' })">成功</w-button>
            </w-space>
            <w-message-box ref="msgBoxRef" />
          </w-form-item>
        </div>
      </w-card>

      <!-- ========== 📎 其他组件 ========== -->
      <w-card header="📎 其他组件" class="category-card">
        <div class="component-grid">
          <w-form-item label="Divider 分割线">
            <div>上方内容</div>
            <w-divider />
            <div>下方内容</div>
          </w-form-item>

          <w-form-item label="Watermark 水印">
            <w-watermark content="水印" :font-size="12" color="rgba(0,0,0,0.08)" :rotate="-15">
              <div style="padding:16px;background:#fff;border:1px solid #d4d0c8">
                <p style="margin:0">带水印的内容区域</p>
              </div>
            </w-watermark>
          </w-form-item>

          <w-form-item label="PageContainer 页面容器">
            <w-page-container title="用户管理" :breadcrumb="[{ label: '首页', path: '/' }, { label: '用户管理' }]">
              <p style="margin:0">页面内容区域</p>
            </w-page-container>
          </w-form-item>

          <w-form-item label="Permission 权限控制">
            <w-permission code="user:view" :has="checkPermission">
              <w-button size="small">查看用户（有权限）</w-button>
            </w-permission>
          </w-form-item>
        </div>
      </w-card>
    </w-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  input: '',
  number: 0,
  tags: ['标签1', '标签2'],
  otp: '',
  auto: '',
  cascader: [] as string[],
  checkbox: [] as string[],
  color: '#245edb',
  date: '',
  datetime: '',
  radio: 'A',
  rate: 3,
  select: '',
  slider: 30,
  switch: true,
  time: '',
  timeselect: '',
  transfer: [] as string[],
  treeselect: '',
  mention: '',
  page: 1,
  segment: 'day',
  calDate: new Date()
})

const searchModel = reactive({ name: '', status: '' })
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]

function onSearch(model: Record<string, any>) {
  alert('搜索: ' + JSON.stringify(model))
}
function onReset() {
  alert('已重置')
}

const autocompleteOptions = [
  { value: '苹果', label: '苹果' },
  { value: '香蕉', label: '香蕉' },
  { value: '橙子', label: '橙子' }
]

const cascaderOptions = [
  { label: '北京', value: 'beijing', children: [{ label: '朝阳区', value: 'chaoyang' }, { label: '海淀区', value: 'haidian' }] },
  { label: '上海', value: 'shanghai', children: [{ label: '浦东新区', value: 'pudong' }] }
]

const selectOptions = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]

const transferData = [
  { key: '1', label: '项目1' },
  { key: '2', label: '项目2' },
  { key: '3', label: '项目3' },
  { key: '4', label: '项目4' }
]

const treeData = [
  { label: '节点1', value: '1', children: [{ label: '子节点1-1', value: '1-1' }] },
  { label: '节点2', value: '2' }
]

const mentionOptions = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' }
]

const tableData = [
  { name: '张三', age: 28, address: '北京' },
  { name: '李四', age: 32, address: '上海' }
]

const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' }
]

const calendarEvents = [
  { date: new Date().toISOString().slice(0, 10), title: '今日事件' }
]

const dialogs = reactive({ basic: false })
const drawers = reactive({ right: false })
const msgRef = ref<any>(null)
const notifyRef = ref<any>(null)
const msgBoxRef = ref<any>(null)
const showTour = ref(false)

function alert(msg: string) {
  window.alert(msg)
}

function checkPermission(code: string) {
  const permissions = ['user:view', 'user:edit']
  return permissions.includes(code)
}
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.page-desc { font-size: 13px; color: #666; margin-bottom: 20px; }
.page-desc code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 12px; }

.all-form { display: flex; flex-direction: column; gap: 16px; }

.category-card :deep(.w-card__header) { font-weight: bold; font-size: 15px; }

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.component-grid :deep(.w-form-item) {
  margin-bottom: 0;
}

.component-grid :deep(.w-form-item__content) {
  min-height: auto;
}
</style>
