<template>
  <w-config-provider prefix="w" :size="globalSize" :theme="globalTheme">
    <div class="playground">
      <header class="playground-header">
        <h1>🖥️ Windows UI</h1>
        <p>Vue 3 UI Library - Windows XP Style</p>
        <div class="global-controls">
          <a href="admin.html" class="admin-link" title="进入 Admin 后台">🏢 Admin 后台</a>
          <div class="control-group">
            <span class="control-label">尺寸</span>
            <button
              v-for="s in ['small', 'default', 'large']"
              :key="s"
              :class="['size-btn', { active: globalSize === s }]"
              @click="globalSize = s as any"
            >
              {{ s }}
            </button>
          </div>
          <div class="control-group">
            <span class="control-label">主题色</span>
            <button class="preset-btn" style="background:#245edb" @click="themeColors.primary = '#245edb'; updateTheme()" />
            <button class="preset-btn" style="background:#ff69b4" @click="themeColors.primary = '#ff69b4'; updateTheme()" />
            <button class="preset-btn" style="background:#d92b2b" @click="themeColors.primary = '#d92b2b'; updateTheme()" />
            <button class="preset-btn" style="background:#3a9e3a" @click="themeColors.primary = '#3a9e3a'; updateTheme()" />
            <input type="color" :value="themeColors.primary" @change="e => { themeColors.primary = (e.target as HTMLInputElement).value; updateTheme() }" class="color-input" title="primary" />
            <button class="reset-btn" @click="resetTheme">重置</button>
            <div class="color-preview" :style="{ backgroundColor: themeColors.primary }"></div>
          </div>
        </div>
      </header>

      <div class="playground-body">
        <aside class="playground-sidebar">
          <nav class="sidebar-nav">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="['sidebar-link', { 'is-active': isActive(item.path) }, { 'is-indented': item.indent }]"
            >
              <w-icon v-if="item.icon && !item.indent" :name="item.icon" size="small" />
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </aside>

        <main class="playground-content">
          <router-view />
        </main>
      </div>
    </div>
  </w-config-provider>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const $route = useRoute()

const isActive = (path: string) => {
  return $route.path === path || (path !== '/' && $route.path.startsWith(path + '/'))
}

const globalSize = ref<'small' | 'default' | 'large'>('default')

const defaultColors = {
  primary: '#245edb',
  success: '#3a9e3a',
  warning: '#e4a010',
  danger: '#d92b2b',
}

const themeColors = reactive({ ...defaultColors })

const globalTheme = computed(() => {
  const t: Record<string, string> = {}
  if (themeColors.primary !== defaultColors.primary) t.primary = themeColors.primary
  if (themeColors.success !== defaultColors.success) t.success = themeColors.success
  if (themeColors.warning !== defaultColors.warning) t.warning = themeColors.warning
  if (themeColors.danger !== defaultColors.danger) t.danger = themeColors.danger
  return t
})

function updateTheme() {
  // themeColors 变化会自动触发 globalTheme computed 重新计算
}

function resetTheme() {
  Object.assign(themeColors, defaultColors)
}

const navItems = [
    { path: '/', label: '🏠 首页', icon: 'home' },
    { path: '/basic', label: '基础组件', icon: 'folder' },
    { path: '/basic/button', label: 'Button 按钮', indent: true },
    { path: '/basic/border', label: 'Border 边框', indent: true },
    { path: '/basic/color', label: 'Color 色彩', indent: true },
    { path: '/basic/container', label: 'Container 布局容器', indent: true },
    { path: '/basic/icon', label: 'Icon 图标', indent: true },
    { path: '/basic/layout', label: 'Layout 布局', indent: true },
    { path: '/basic/link', label: 'Link 链接', indent: true },
    { path: '/basic/text', label: 'Text 文本', indent: true },
    { path: '/basic/scrollbar', label: 'Scrollbar 滚动条', indent: true },
    { path: '/basic/space', label: 'Space 间距', indent: true },
    { path: '/basic/splitter', label: 'Splitter 分隔面板', indent: true },
    { path: '/basic/typography', label: 'Typography 排版', indent: true },
    { path: '/basic/configprovider', label: 'ConfigProvider 全局配置', indent: true },
    { path: '/basic/admin-layout', label: 'AdminLayout 后台布局', indent: true },
    { path: '/form', label: '表单组件', icon: 'folder' },
    { path: '/form/input', label: 'Input 输入框', indent: true },
    { path: '/form/input-number', label: 'Input Number 数字输入框', indent: true },
    { path: '/form/input-tag', label: 'Input Tag 标签输入框', indent: true },
    { path: '/form/input-otp', label: 'Input OTP 验证码', indent: true },
    { path: '/form/autocomplete', label: 'Autocomplete 自动补全', indent: true },
    { path: '/form/cascader', label: 'Cascader 级联选择器', indent: true },
    { path: '/form/checkbox', label: 'Checkbox 多选框', indent: true },
    { path: '/form/color-picker', label: 'Color Picker 颜色选择器', indent: true },
    { path: '/form/date-picker', label: 'Date Picker 日期选择器', indent: true },
    { path: '/form/datetime-picker', label: 'DateTime Picker 日期时间选择器', indent: true },
    { path: '/form/radio', label: 'Radio 单选框', indent: true },
    { path: '/form/rate', label: 'Rate 评分', indent: true },
    { path: '/form/select', label: 'Select 选择器', indent: true },
    { path: '/form/slider', label: 'Slider 滑块', indent: true },
    { path: '/form/switch', label: 'Switch 开关', indent: true },
    { path: '/form/time-picker', label: 'Time Picker 时间选择器', indent: true },
    { path: '/form/time-select', label: 'Time Select 时间选择', indent: true },
    { path: '/form/transfer', label: 'Transfer 穿梭框', indent: true },
    { path: '/form/tree-select', label: 'Tree Select 树形选择', indent: true },
    { path: '/form/upload', label: 'Upload 上传器', indent: true },
    { path: '/form/mention', label: 'Mention 提及', indent: true },
    { path: '/form/form', label: 'Form 表单', indent: true },
    { path: '/form/search-form', label: 'SearchForm 搜索表单', indent: true },
    { path: '/data', label: '数据展示', icon: 'folder' },
    { path: '/data/avatar', label: 'Avatar 头像', indent: true },
    { path: '/data/badge', label: 'Badge 徽章', indent: true },
    { path: '/data/calendar', label: 'Calendar 日历', indent: true },
    { path: '/data/card', label: 'Card 卡片', indent: true },
    { path: '/data/carousel', label: 'Carousel 走马灯', indent: true },
    { path: '/data/collapse', label: 'Collapse 折叠面板', indent: true },
    { path: '/data/descriptions', label: 'Descriptions 描述列表', indent: true },
    { path: '/data/empty', label: 'Empty 空状态', indent: true },
    { path: '/data/image', label: 'Image 图片', indent: true },
    { path: '/data/pagination', label: 'Pagination 分页', indent: true },
    { path: '/data/progress', label: 'Progress 进度条', indent: true },
    { path: '/data/result', label: 'Result 结果', indent: true },
    { path: '/data/skeleton', label: 'Skeleton 骨架屏', indent: true },
    { path: '/data/table', label: 'Table 表格', indent: true },
    { path: '/data/tag', label: 'Tag 标签', indent: true },
    { path: '/data/timeline', label: 'Timeline 时间线', indent: true },
    { path: '/data/tree', label: 'Tree 树形控件', indent: true },
    { path: '/data/statistic', label: 'Statistic 统计组件', indent: true },
    { path: '/data/segmented', label: 'Segmented 分段控制器', indent: true },
    { path: '/data/tour', label: 'Tour 漫游式引导', indent: true },
    { path: '/data/infinite-scroll', label: 'Infinite Scroll 无限滚动', indent: true },
    { path: '/nav', label: '导航组件', icon: 'folder' },
    { path: '/nav/breadcrumb', label: 'Breadcrumb 面包屑', indent: true },
    { path: '/nav/dropdown', label: 'Dropdown 下拉菜单', indent: true },
    { path: '/nav/menu', label: 'Menu 菜单', indent: true },
    { path: '/nav/page-header', label: 'Page Header 页头', indent: true },
    { path: '/nav/steps', label: 'Steps 步骤条', indent: true },
    { path: '/nav/tabs', label: 'Tabs 标签页', indent: true },
    { path: '/nav/backtop', label: 'Backtop 回到顶部', indent: true },
    { path: '/nav/anchor', label: 'Anchor 锚点', indent: true },
    { path: '/nav/affix', label: 'Affix 固钉', indent: true },
    { path: '/feedback', label: '反馈组件', icon: 'folder' },
    { path: '/feedback/alert', label: 'Alert 提示', indent: true },
    { path: '/feedback/dialog', label: 'Dialog 对话框', indent: true },
    { path: '/feedback/drawer', label: 'Drawer 抽屉', indent: true },
    { path: '/feedback/loading', label: 'Loading 加载', indent: true },
    { path: '/feedback/message', label: 'Message 消息提示', indent: true },
    { path: '/feedback/notification', label: 'Notification 通知', indent: true },
    { path: '/feedback/popconfirm', label: 'Popconfirm 气泡确认框', indent: true },
    { path: '/feedback/popover', label: 'Popover 弹出框', indent: true },
    { path: '/feedback/tooltip', label: 'Tooltip 文字提示', indent: true },
    { path: '/feedback/message-box', label: 'Message Box 消息弹出框', indent: true },
    { path: '/others', label: '其他组件', icon: 'folder' },
    { path: '/others/divider', label: 'Divider 分割线', indent: true },
    { path: '/others/watermark', label: 'Watermark 水印', indent: true },
    { path: '/others/page-container', label: 'PageContainer 页面容器', indent: true },
    { path: '/others/permission', label: 'Permission 权限控制', indent: true }
]
</script>

<style scoped>
.playground { min-height: 100vh; display: flex; flex-direction: column; }
.playground-header { text-align: center; padding: 20px; background: var(--w-xp-title-bar); color: #fff; flex-shrink: 0; }
.playground-header h1 { margin: 0 0 6px; font-size: 28px; }
.playground-header p { margin: 0 0 12px; opacity: 0.9; font-size: 13px; }
.global-controls { display: inline-flex; align-items: center; gap: 24px; background: rgba(0,0,0,0.15); padding: 8px 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); }
.control-group { display: flex; align-items: center; gap: 8px; }
.control-label { font-size: 12px; opacity: 0.9; }
.size-btn { padding: 3px 10px; border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-size: 12px; border-radius: 2px; }
.size-btn:hover { background: rgba(255,255,255,0.25); }
.size-btn.active { background: rgba(255,255,255,0.9); color: var(--w-color-primary); font-weight: bold; border-color: #fff; }
.preset-btn { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.6); border-radius: 3px; cursor: pointer; padding: 0; }
.color-input { width: 24px; height: 24px; border: 1px solid rgba(255,255,255,0.4); padding: 0; background: none; cursor: pointer; }
.color-preview { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.6); border-radius: 3px; }
.reset-btn { padding: 3px 10px; border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-size: 12px; border-radius: 2px; }
.reset-btn:hover { background: rgba(255,255,255,0.25); }
.admin-link { padding: 4px 12px; border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.15); color: #fff; text-decoration: none; font-size: 12px; border-radius: 2px; margin-right: 8px; }
.admin-link:hover { background: rgba(255,255,255,0.3); }
.playground-body { display: flex; flex: 1; max-width: 1600px; margin: 0 auto; width: 100%; padding: 16px; gap: 16px; }
.playground-sidebar { width: 220px; flex-shrink: 0; position: sticky; top: 16px; align-self: flex-start; max-height: calc(100vh - 32px); overflow-y: auto; }
.sidebar-nav { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; }
.sidebar-link { display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #000; text-decoration: none; font-size: 13px; border-bottom: 1px solid #d4d0c8; transition: background 0.15s; }
.sidebar-link:last-child { border-bottom: none; }
.sidebar-link:hover { background: var(--w-color-primary-light); color: #fff; }
.sidebar-link.is-active { background: var(--w-color-primary); color: #fff; font-weight: bold; }
.sidebar-link.is-indented { padding-left: 28px; font-size: 12px; background: #f5f5f5; }
.sidebar-link.is-indented:hover { background: #e8e8e8; color: var(--w-color-primary); }
.sidebar-link.is-indented.is-active { background: #dcebfc; color: var(--w-color-primary); }
.playground-content { flex: 1; min-width: 0; }
</style>
