<template>
  <div class="w-search-form">
    <w-form :model="model">
      <div class="w-search-form__fields" :class="{ collapsed: !expanded }">
        <slot />
      </div>
      <div class="w-search-form__actions">
        <w-button type="primary" @click="handleSearch">
          <w-icon name="search" size="small" /> 查询
        </w-button>
        <w-button @click="handleReset">
          <w-icon name="refresh" size="small" /> 重置
        </w-button>
        <w-button v-if="collapsible" type="text" @click="expanded = !expanded">
          {{ expanded ? '收起' : '展开' }}
          <w-icon :name="expanded ? 'arrowUp' : 'arrowDown'" size="small" />
        </w-button>
      </div>
    </w-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WForm from '../form/form.vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'

defineOptions({ name: 'WSearchForm' })
const props = defineProps({
  model: { type: Object as () => Record<string, any>, default: () => ({}) },
  collapsible: { type: Boolean, default: false }
})
const emit = defineEmits(['search', 'reset'])

const expanded = ref(true)

const handleSearch = () => {
  emit('search', props.model)
}

const handleReset = () => {
  Object.keys(props.model).forEach((key) => {
    props.model[key] = undefined
  })
  emit('reset')
}
</script>

<style scoped>
.w-search-form { padding: 12px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; margin-bottom: 12px; }
.w-search-form__fields { display: flex; flex-wrap: wrap; gap: 12px; }
.w-search-form__fields.collapsed { max-height: 44px; overflow: hidden; }
.w-search-form__actions { display: flex; gap: 8px; margin-top: 12px; }
</style>
