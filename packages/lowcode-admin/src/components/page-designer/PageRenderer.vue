<template>
  <div class="page-renderer">
    <render-component
      v-for="(node, index) in pageConfig.components"
      :key="node.id || index"
      :node="node"
      :page-code="pageCode"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import * as pageApi from '@/api/page'
import RenderComponent from './RenderComponent.vue'

const props = defineProps<{
  code?: string
  config?: any
  preview?: boolean
}>()

const pageCode = computed(() => props.code || '')

const pageConfig = reactive<any>({
  title: '',
  description: '',
  components: []
})

onMounted(() => loadConfig())

async function loadConfig() {
  if (props.config) {
    Object.assign(pageConfig, props.config)
  } else if (props.code) {
    const data = await pageApi.getPage(props.code)
    Object.assign(pageConfig, data.config || {})
  }
}
</script>

<style scoped>
.page-renderer { padding: 12px; }
</style>
