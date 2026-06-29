<template>
  <div :class="['w-admin-layout', `w-admin-layout--${size}`]">
    <aside class="w-admin-layout__sidebar" :class="{ collapsed: isCollapsed, 'w-admin-layout__sidebar--drawer': isDrawer }">
      <div class="w-admin-layout__logo">
        <slot name="logo">
          <w-icon name="computer" :size="size" />
          <span v-show="!isCollapsed">{{ title }}</span>
        </slot>
      </div>
      <div v-if="showMenuSearch && !isCollapsed" class="w-admin-layout__menu-search">
        <w-input v-model="menuQuery" placeholder="搜索菜单" size="small" />
      </div>
      <div class="w-admin-layout__menu">
        <slot name="menu" :collapsed="isCollapsed" :search="menuQuery" :favorites="favoriteSet" />
      </div>
    </aside>
    <div v-if="isDrawer && !isCollapsed" class="w-admin-layout__mask" @click="closeDrawer" />
    <div class="w-admin-layout__main">
      <header class="w-admin-layout__header">
        <div class="w-admin-layout__header-left">
          <slot name="toggle" :collapsed="isCollapsed" :toggle="toggleCollapsed">
            <w-button type="text" :size="size" @click="toggleCollapsed">
              <w-icon :name="isCollapsed ? 'arrowRight' : 'arrowLeft'" :size="size" />
            </w-button>
          </slot>
          <w-breadcrumb v-if="breadcrumb.length" :items="breadcrumb" :size="size" />
        </div>
        <div class="w-admin-layout__header-right">
          <slot name="header-actions" />
          <w-button v-if="showMenuSearch" type="text" :size="size" @click="emit('menu-search')">
            <w-icon name="search" :size="size" />
          </w-button>
          <w-button v-if="showScreenfull" type="text" :size="size" @click="emit('screenfull')">
            <w-icon name="fullscreen" :size="size" />
          </w-button>
          <w-dropdown v-if="showUserDropdown" @command="handleUserCommand">
            <w-button type="text" :size="size">
              <w-icon name="user" :size="size" />
              <span v-if="userInfo.name">{{ userInfo.name }}</span>
              <w-icon name="arrowDown" :size="size" />
            </w-button>
            <template #dropdown>
              <w-dropdown-menu>
                <w-dropdown-item v-for="item in userMenu" :key="item.command" :command="item.command">
                  {{ item.label }}
                </w-dropdown-item>
              </w-dropdown-menu>
            </template>
          </w-dropdown>
        </div>
      </header>
      <div v-if="tabs.length" class="w-admin-layout__tabs">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          :class="['w-admin-layout__tab', { 'is-active': activeTab === tab.name }]"
          @click="selectTab(tab.name)"
        >
          {{ tab.title }}
          <w-icon v-if="tab.closable !== false" name="close" :size="size" @click.stop="emit('tab-close', tab.name)" />
        </div>
      </div>
      <main class="w-admin-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WIcon from '../icon/icon.vue'
import WInput from '../input/input.vue'
import WButton from '../button/button.vue'
import WBreadcrumb from '../breadcrumb/breadcrumb.vue'
import WDropdown from '../dropdown/dropdown.vue'
import WDropdownMenu from '../dropdown/dropdown-menu.vue'
import WDropdownItem from '../dropdown/dropdown-item.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WAdminLayout' })
const props = defineProps({
  collapsed: { type: Boolean, default: false },
  title: { type: String, default: 'Admin' },
  size: { type: String, default: undefined },
  tabs: { type: Array as () => { name: string; title: string; closable?: boolean }[], default: () => [] },
  activeTab: { type: String, default: '' },
  breadcrumb: { type: Array as () => { label: string; path?: string }[], default: () => [] },
  userInfo: { type: Object as () => { name?: string }, default: () => ({}) },
  userMenu: { type: Array as () => { label: string; command: string }[], default: () => [{ label: '个人中心', command: 'profile' }, { label: '退出登录', command: 'logout' }] },
  showUserDropdown: { type: Boolean, default: true },
  showScreenfull: { type: Boolean, default: true },
  showMenuSearch: { type: Boolean, default: true },
  favorites: { type: Array as () => string[], default: () => [] },
  drawerBreakpoint: { type: Number, default: 768 }
})
const emit = defineEmits(['update:collapsed', 'tab-change', 'tab-close', 'screenfull', 'menu-search', 'user-command', 'logout'])

const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const internalCollapsed = ref(props.collapsed)
const isMobile = ref(false)
const menuQuery = ref('')
const favoriteSet = computed(() => new Set(props.favorites))

watch(() => props.collapsed, (v) => { internalCollapsed.value = v })

const isCollapsed = computed({
  get: () => internalCollapsed.value,
  set: (v) => { internalCollapsed.value = v; emit('update:collapsed', v) }
})

const isDrawer = computed(() => isMobile.value)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= props.drawerBreakpoint
  if (isMobile.value) internalCollapsed.value = true
}

const toggleCollapsed = () => { isCollapsed.value = !isCollapsed.value }
const closeDrawer = () => { isCollapsed.value = true }

const selectTab = (name: string) => { emit('tab-change', name) }
const handleUserCommand = (command: string) => {
  emit('user-command', command)
  if (command === 'logout') emit('logout')
}

if (typeof window !== 'undefined') {
  checkMobile()
  window.addEventListener('resize', checkMobile)
}
</script>

<style scoped>
.w-admin-layout { display: flex; height: 100vh; height: 100dvh; overflow: hidden; font-family: var(--w-font-family); }
.w-admin-layout__sidebar { width: 220px; flex-shrink: 0; background: var(--w-bg-color); border-right: 2px solid #808080; display: flex; flex-direction: column; transition: width 0.2s; height: 100%; overflow: hidden; z-index: 100; }
.w-admin-layout__sidebar.collapsed { width: 64px; }
.w-admin-layout__sidebar--drawer { position: fixed; left: 0; top: 0; bottom: 0; box-shadow: 2px 0 8px rgba(0,0,0,0.2); }
.w-admin-layout__sidebar--drawer.collapsed { transform: translateX(-100%); }
.w-admin-layout__logo { display: flex; align-items: center; gap: 8px; padding: 12px; border-bottom: 1px solid #d4d0c8; font-weight: bold; color: var(--w-color-primary); white-space: nowrap; overflow: hidden; flex-shrink: 0; }
.w-admin-layout__menu-search { padding: 8px; border-bottom: 1px solid #d4d0c8; }
.w-admin-layout__menu { padding: 4px; flex: 1; min-height: 0; overflow-y: auto; }
.w-admin-layout__main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
.w-admin-layout__header { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: var(--w-bg-color); border-bottom: 2px solid; border-color: #fff #808080 #808080 #fff; flex-shrink: 0; }
.w-admin-layout__header-left, .w-admin-layout__header-right { display: flex; align-items: center; gap: 8px; }
.w-admin-layout__tabs { display: flex; gap: 4px; padding: 6px 12px; background: var(--w-bg-color); border-bottom: 1px solid #d4d0c8; flex-shrink: 0; }
.w-admin-layout__tab { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; cursor: pointer; border: 1px solid #d4d0c8; background: #f0f0f0; font-size: var(--w-font-size-base); }
.w-admin-layout__tab.is-active { background: var(--w-color-primary); color: #fff; border-color: var(--w-color-primary); }
.w-admin-layout__content { flex: 1; padding: 16px; overflow: auto; }
.w-admin-layout__mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }

.w-admin-layout--small .w-admin-layout__logo { padding: 8px; font-size: var(--w-font-size-small); }
.w-admin-layout--small .w-admin-layout__tab { padding: 2px 8px; font-size: var(--w-font-size-small); }
.w-admin-layout--large .w-admin-layout__logo { padding: 16px; font-size: var(--w-font-size-large); }
.w-admin-layout--large .w-admin-layout__tab { padding: 6px 16px; font-size: var(--w-font-size-medium); }
</style>
