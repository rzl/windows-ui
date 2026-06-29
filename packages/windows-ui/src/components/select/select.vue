<template>
  <div :class="['w-select', `w-select--${size}`, { 'w-select--multiple': multiple }]" v-click-outside="close">
    <div class="w-select__trigger" @click="handleTriggerClick">
      <template v-if="filterable && open">
        <input
          ref="inputRef"
          v-model="query"
          class="w-select__input"
          :placeholder="placeholder"
          @input="handleInput"
          @click.stop
        />
      </template>
      <template v-else>
        <template v-if="multiple">
          <span v-if="selectedValues.length" class="w-select__tags">
            <span v-for="v in selectedValues" :key="v" class="w-select__tag">
              {{ labelOf(v) }}
              <w-icon name="close" :size="size" class="w-select__tag-close" @click.stop="removeTag(v)" />
            </span>
          </span>
          <span v-else class="w-select__placeholder">{{ placeholder }}</span>
        </template>
        <span v-else-if="selectedLabel">{{ selectedLabel }}</span>
        <span v-else class="w-select__placeholder">{{ placeholder }}</span>
      </template>
      <div class="w-select__icons">
        <w-icon v-if="clearable && hasValue" name="close" :size="size" class="w-select__clear" @click.stop="handleClear" />
        <w-icon name="arrowDown" :size="size" @click.stop="toggleOpen" />
      </div>
    </div>
    <div v-show="open" class="w-select__dropdown">
      <div class="w-select__options">
        <div
          v-for="opt in displayOptions"
          :key="opt.value"
          :class="['w-select__option', { 'is-selected': isSelected(opt.value), 'is-disabled': opt.disabled }]"
          @click="select(opt)"
        >{{ opt.label }}</div>
        <div v-if="!displayOptions.length" class="w-select__empty">{{ loading ? '加载中...' : '无匹配数据' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, type PropType } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WSelect' })

const props = defineProps({
  modelValue: [String, Number, Array] as any,
  options: { type: Array as () => { label: string; value: any; disabled?: boolean }[], default: () => [] },
  placeholder: { type: String, default: '请选择' },
  clearable: { type: Boolean, default: true },
  filterable: { type: Boolean, default: false },
  filterMethod: { type: Function as PropType<(option: any, query: string) => boolean>, default: null },
  remote: { type: Boolean, default: false },
  remoteMethod: { type: Function as PropType<(query: string) => void>, default: null },
  loading: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  size: { type: String, default: undefined }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear'])
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

const open = ref(false)
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => open.value, (val) => {
  if (!val) query.value = ''
})

const selectedValues = computed(() => props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : [props.modelValue])
const selectedLabel = computed(() => props.options.find(o => o.value === props.modelValue)?.label)
const hasValue = computed(() => props.multiple ? selectedValues.value.length > 0 : props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '')

const labelOf = (value: any) => props.options.find(o => o.value === value)?.label || value

const isSelected = (value: any) => {
  if (props.multiple) return selectedValues.value.includes(value)
  return props.modelValue === value
}

const localFilter = computed(() => {
  if (!props.filterable || !query.value || props.remote) return props.options
  const keyword = query.value.trim().toLowerCase()
  if (props.filterMethod) return props.options.filter(o => props.filterMethod!(o, keyword))
  return props.options.filter(o => String(o.label).toLowerCase().includes(keyword))
})

const displayOptions = computed(() => localFilter.value)

let remoteTimer: any = null
const triggerRemote = (q: string) => {
  if (!props.remote || !props.remoteMethod) return
  if (remoteTimer) clearTimeout(remoteTimer)
  remoteTimer = setTimeout(() => props.remoteMethod!(q), 200)
}

const handleTriggerClick = () => {
  if (props.filterable) {
    open.value = true
    nextTick(() => inputRef.value?.focus())
  } else {
    open.value = !open.value
  }
}

const toggleOpen = () => { open.value = !open.value }

const handleInput = () => {
  open.value = true
  if (props.remote) triggerRemote(query.value)
}

const select = (opt: any) => {
  if (opt.disabled) return
  if (props.multiple) {
    const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = arr.indexOf(opt.value)
    if (idx > -1) arr.splice(idx, 1)
    else arr.push(opt.value)
    emit('update:modelValue', arr)
    emit('change', arr)
    query.value = ''
    return
  }
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  open.value = false
  query.value = ''
}

const removeTag = (value: any) => {
  const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const idx = arr.indexOf(value)
  if (idx > -1) {
    arr.splice(idx, 1)
    emit('update:modelValue', arr)
    emit('change', arr)
  }
}

const close = () => { open.value = false }

const handleClear = () => {
  const val = props.multiple ? [] : undefined
  emit('update:modelValue', val)
  emit('change', val)
  emit('clear')
  query.value = ''
}

const vClickOutside = {
  mounted(el: any, binding: any) {
    el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value() }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: any) { document.removeEventListener('click', el._clickOutside) }
}
</script>

<style scoped>
.w-select { position: relative; display: inline-block; min-width: 120px; }
.w-select__trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; box-sizing: border-box; padding: 2px 4px; border: 1px solid #7f9db9; background: #fff; cursor: pointer; font-family: var(--w-font-family); font-size: var(--w-font-size-base); height: var(--w-component-size); }
.w-select--small .w-select__trigger { padding: 1px 2px; height: var(--w-component-size-small); font-size: var(--w-font-size-small); }
.w-select--large .w-select__trigger { padding: 4px 6px; height: var(--w-component-size-large); font-size: var(--w-font-size-medium); }
.w-select__placeholder { color: var(--w-text-color-placeholder); }
.w-select__input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font: inherit; color: var(--w-text-color-primary); height: 100%; padding: 0; }
.w-select__input::placeholder { color: var(--w-text-color-placeholder); }
.w-select__tags { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.w-select__tag { display: inline-flex; align-items: center; gap: 2px; padding: 1px 4px; background: var(--w-color-primary); color: #fff; border-radius: 2px; font-size: var(--w-font-size-small); }
.w-select__tag-close { cursor: pointer; }
.w-select__dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: var(--w-index-popper); background: var(--w-bg-color); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); max-height: 200px; overflow-y: auto; }
.w-select__options { max-height: 200px; overflow-y: auto; }
.w-select__option { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); line-height: 1.5; }
.w-select__option:hover, .w-select__option.is-selected { background: var(--w-xp-blue); color: #fff; }
.w-select__option.is-disabled { opacity: 0.5; cursor: not-allowed; }
.w-select--small .w-select__option { padding: 2px 6px; font-size: var(--w-font-size-small); }
.w-select--large .w-select__option { padding: 6px 10px; font-size: var(--w-font-size-medium); }
.w-select__empty { padding: 8px; color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); text-align: center; }
.w-select__icons { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.w-select__clear { cursor: pointer; }
</style>
