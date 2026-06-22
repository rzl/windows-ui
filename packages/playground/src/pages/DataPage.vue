<template>
  <div class="demo-page">
    <h1 class="page-title">{{ t('数据展示') }}</h1>
    <div class="component-grid">
      <router-link to="/data/avatar" class="component-card">
        <h3>Avatar 头像</h3>
        <p>{{ t('用户头像展示') }}</p>
      </router-link>
      <router-link to="/data/badge" class="component-card">
        <h3>Badge 徽章</h3>
        <p>{{ t('徽标数字/状态') }}</p>
      </router-link>
      <router-link to="/data/calendar" class="component-card">
        <h3>Calendar 日历</h3>
        <p>{{ t('日历展示') }}</p>
      </router-link>
      <router-link to="/data/card" class="component-card">
        <h3>Card 卡片</h3>
        <p>{{ t('内容容器') }}</p>
      </router-link>
      <router-link to="/data/carousel" class="component-card">
        <h3>Carousel 走马灯</h3>
        <p>{{ t('轮播图') }}</p>
      </router-link>
      <router-link to="/data/collapse" class="component-card">
        <h3>Collapse 折叠面板</h3>
        <p>{{ t('内容折叠展开') }}</p>
      </router-link>
      <router-link to="/data/descriptions" class="component-card">
        <h3>Descriptions 描述列表</h3>
        <p>{{ t('键值对信息展示') }}</p>
      </router-link>
      <router-link to="/data/empty" class="component-card">
        <h3>Empty 空状态</h3>
        <p>{{ t('无数据展示') }}</p>
      </router-link>
      <router-link to="/data/image" class="component-card">
        <h3>Image 图片</h3>
        <p>{{ t('图片展示与预览') }}</p>
      </router-link>
      <router-link to="/data/pagination" class="component-card">
        <h3>Pagination 分页</h3>
        <p>{{ t('分页导航') }}</p>
      </router-link>
      <router-link to="/data/progress" class="component-card">
        <h3>Progress 进度条</h3>
        <p>{{ t('进度指示') }}</p>
      </router-link>
      <router-link to="/data/result" class="component-card">
        <h3>Result 结果</h3>
        <p>{{ t('操作结果反馈') }}</p>
      </router-link>
      <router-link to="/data/skeleton" class="component-card">
        <h3>Skeleton 骨架屏</h3>
        <p>{{ t('加载占位') }}</p>
      </router-link>
      <router-link to="/data/table" class="component-card">
        <h3>Table 表格</h3>
        <p>{{ t('数据表格') }}</p>
      </router-link>
      <router-link to="/data/tag" class="component-card">
        <h3>Tag 标签</h3>
        <p>{{ t('标记与分类') }}</p>
      </router-link>
      <router-link to="/data/timeline" class="component-card">
        <h3>Timeline 时间线</h3>
        <p>{{ t('时间轴展示') }}</p>
      </router-link>
      <router-link to="/data/tree" class="component-card">
        <h3>Tree 树形控件</h3>
        <p>{{ t('层级数据展示') }}</p>
      </router-link>
      <router-link to="/data/statistic" class="component-card">
        <h3>Statistic 统计组件</h3>
        <p>{{ t('数值展示') }}</p>
      </router-link>
      <router-link to="/data/segmented" class="component-card">
        <h3>Segmented 分段控制器</h3>
        <p>{{ t('分段选项') }}</p>
      </router-link>
      <router-link to="/data/tour" class="component-card">
        <h3>Tour 漫游式引导</h3>
        <p>{{ t('新用户引导') }}</p>
      </router-link>
      <router-link to="/data/infinite-scroll" class="component-card">
        <h3>Infinite Scroll 无限滚动</h3>
        <p>{{ t('滚动加载更多') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.page-title { font-size: 24px; color: var(--w-color-primary); margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid var(--w-border-color); }
.component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.component-card { display: block; background: var(--w-bg-color); border: 2px solid; border-color: var(--w-border-color-light) var(--w-border-color-dark) var(--w-border-color-dark) var(--w-border-color-light); padding: 16px; text-decoration: none; color: inherit; transition: transform .1s; }
.component-card:hover { transform: translateY(-2px); background: var(--w-fill-color); }
.component-card h3 { margin: 0 0 8px; font-size: 16px; color: var(--w-color-primary); }
.component-card p { margin: 0; font-size: 12px; color: var(--w-text-color-secondary); }
</style>
