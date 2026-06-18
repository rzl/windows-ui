<template>
  <div class="dashboard-page">
    <div class="widget-grid">
      <template v-for="(widget, index) in config.widgets" :key="index">
        <w-card :header="widget.title" class="widget-card" :class="widget.type === 'dashboard' || widget.type === 'notice' ? 'widget-wide' : ''">
          <stat-widget v-if="widget.type === 'stat'" :widget="widget" :stats="stats" />
          <link-widget v-else-if="widget.type === 'link'" :widget="widget" />
          <dashboard-widget v-else-if="widget.type === 'dashboard'" :widget="widget" />
          <notice-widget v-else-if="widget.type === 'notice'" :widget="widget" />
        </w-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import * as dashboardApi from '@/api/dashboard'
import StatWidget from '@/components/portal/StatWidget.vue'
import LinkWidget from '@/components/portal/LinkWidget.vue'
import DashboardWidget from '@/components/portal/DashboardWidget.vue'
import NoticeWidget from '@/components/portal/NoticeWidget.vue'

const route = useRoute()
const dashboardCode = computed(() => route.params.code as string)
const isRunMode = computed(() => !!dashboardCode.value)

const config = reactive<any>({ widgets: [] })
const stats = reactive<any>({})

onMounted(() => loadData())

async function loadData() {
  if (isRunMode.value) {
    // 运行模式：渲染单个仪表盘
    const dashboard = await dashboardApi.getDashboard(dashboardCode.value)
    config.widgets = [{
      type: 'dashboard',
      title: dashboard.name,
      dashboardCode: dashboard.code
    }]
  } else {
    // 首页模式：渲染首页配置
    const configData = await dashboardApi.getHomepageConfig('default')
    Object.assign(config, configData)
  }

  const statsData = await dashboardApi.getStats(config.widgets || [])
  Object.assign(stats, statsData)
}
</script>

<style scoped>
.dashboard-page { padding: 8px; }
.widget-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.widget-card { min-height: 120px; }
.widget-wide { grid-column: span 2; }
</style>
