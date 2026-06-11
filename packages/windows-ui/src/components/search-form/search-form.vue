<template>
  <div class="w-search-form">
    <w-form :model="model">
      <div class="w-search-form__fields" :class="{ collapsed: !expanded }">
        <slot />
      </div>
      <div class="w-search-form__actions">
        <w-button type="primary" :size="size" @click="handleSearch">
          <w-icon name="search" :size="size" /> 查询
        </w-button>
        <w-button :size="size" @click="handleReset">
          <w-icon name="refresh" :size="size" /> 重置
        </w-button>
        <w-button v-if="collapsible" type="text" :size="size" @click="expanded = !expanded">
          {{ expanded ? '收起' : '展开' }}
          <w-icon :name="expanded ? 'arrowUp' : 'arrowDown'" :size="size" />
        </w-button>
      </div>
    </w-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WForm from '../form/form.vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WSearchForm' })
const props = defineProps({
  model: { type: Object as () => Record<string, any>, default: () => ({}) },
  collapsible: { type: Boolean, default: false },
  size: { type: String, default: undefined }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
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
