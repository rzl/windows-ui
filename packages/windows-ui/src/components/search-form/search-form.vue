<template>
  <div class="w-search-form">
    <template v-if="advanced">
      <w-advanced-query-builder :fields="advancedFields" :conditions="conditions" @update:conditions="handleConditionsUpdate" />
      <div class="w-search-form__actions">
        <w-button type="primary" :size="size" @click="handleAdvancedSearch">
          <w-icon name="search" :size="size" /> 查询
        </w-button>
        <w-button :size="size" @click="handleAdvancedReset">
          <w-icon name="refresh" :size="size" /> 重置
        </w-button>
      </div>
    </template>
    <w-form v-else :model="model">
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
import WAdvancedQueryBuilder from '../advanced-query-builder/advanced-query-builder.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WSearchForm' })
const props = defineProps({
  model: { type: Object as () => Record<string, any>, default: () => ({}) },
  collapsible: { type: Boolean, default: false },
  size: { type: String, default: undefined },
  advanced: { type: Boolean, default: false },
  fields: { type: Array as () => { label: string; value: string; type?: string }[], default: () => [] }
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const emit = defineEmits(['search', 'reset', 'update:modelValue'])

const expanded = ref(true)
const conditions = ref<any[]>([])

const advancedFields = computed(() => props.fields.map(f => ({
  prop: f.value,
  label: f.label,
  type: f.type || 'text'
})))

const handleSearch = () => {
  emit('search', props.model)
}

const handleReset = () => {
  Object.keys(props.model).forEach((key) => {
    props.model[key] = undefined
  })
  emit('reset')
}

const handleConditionsUpdate = (val: any[]) => {
  conditions.value = val
}

const handleAdvancedSearch = () => {
  emit('search', { conditions: conditions.value })
}

const handleAdvancedReset = () => {
  conditions.value = []
  emit('reset')
}
</script>

<style scoped>
.w-search-form { padding: 12px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; margin-bottom: 12px; }
.w-search-form__fields { display: flex; flex-wrap: wrap; gap: 12px; }
.w-search-form__fields.collapsed { max-height: 44px; overflow: hidden; }
.w-search-form__actions { display: flex; gap: 8px; margin-top: 12px; }

@media (max-width: 768px) {
  .w-search-form { padding: 10px; }
  .w-search-form__fields { flex-direction: column; gap: 8px; }
  .w-search-form__fields.collapsed { max-height: 72px; }
  .w-search-form__fields :deep(.w-form-item) { width: 100%; margin-bottom: 0; }
  .w-search-form__actions { flex-wrap: wrap; margin-top: 10px; }
}
</style>
