<template>
  <span :class="['w-icon', `w-icon--${size}`]" v-html="svgContent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WIcon' })

const props = defineProps({
  name: { type: String, default: '' },
  svg: { type: String, default: '' },
  size: { type: String, default: undefined },
  color: String
})

const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

const icons: Record<string, string> = {
  // 状态提示
  info: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#1f91e5"/><text x="8" y="12" text-anchor="middle" fill="white" font-size="10" font-family="Arial" font-weight="bold">i</text></svg>',
  warning: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l7 13H1z" fill="#e4a010"/><text x="8" y="13" text-anchor="middle" fill="currentColor" font-size="10" font-family="Arial" font-weight="bold">!</text></svg>',
  error: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#d92b2b"/><text x="8" y="12" text-anchor="middle" fill="white" font-size="10" font-family="Arial" font-weight="bold">x</text></svg>',
  success: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#3a9e3a"/><path d="M4 8l3 3 5-5" stroke="white" stroke-width="2" fill="none"/></svg>',
  help: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#808080"/><text x="8" y="12" text-anchor="middle" fill="white" font-size="10" font-family="Arial" font-weight="bold">?</text></svg>',
  loading: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="2" r="1.5" fill="#245edb"/><circle cx="12" cy="4" r="1.5" fill="#245edb" opacity="0.8"/><circle cx="14" cy="8" r="1.5" fill="#245edb" opacity="0.6"/><circle cx="12" cy="12" r="1.5" fill="#245edb" opacity="0.4"/><circle cx="8" cy="14" r="1.5" fill="#245edb" opacity="0.2"/></svg>',

  // 方向箭头
  arrowUp: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2l6 8H2z" fill="currentColor"/></svg>',
  arrowDown: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 14l-6-8h12z" fill="currentColor"/></svg>',
  arrowLeft: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 8l8-6v12z" fill="currentColor"/></svg>',
  arrowRight: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14 8l-8-6v12z" fill="currentColor"/></svg>',
  'chevron-up': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 10l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'chevron-down': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'chevron-left': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'chevron-right': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  // 操作交互
  close: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2"/></svg>',
  search: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor"/><path d="M11 11l4 4" stroke="currentColor" stroke-width="2"/></svg>',
  more: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="4" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/></svg>',
  delete: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 4h10M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" stroke-width="1" fill="none"/><path d="M7 7v5M9 7v5" stroke="currentColor" stroke-width="1"/></svg>',
  edit: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10.5 2.5l3 3L5 14H2v-3L10.5 2.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  minus: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  refresh: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14 8a6 6 0 01-10 4.2M2 8a6 6 0 0110-4.2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M13 2l1 3.5h-3" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M3 14l-1-3.5h3" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/></svg>',
  settings: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.3 4.3l1.4 1.4M10.3 10.3l1.4 1.4M4.3 11.7l1.4-1.4M10.3 5.7l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  copy: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="5" y="1" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="5" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  upload: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 11V3M4 6l4-4 4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 13h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  download: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2v8M4 9l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  print: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="5" width="12" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="2" width="8" height="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  share: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="12" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="4" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 7l5-2.5M6 9l5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  'zoom-in': '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11 11l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 4.5v5M4.5 7h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  'zoom-out': '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11 11l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.5 7h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7V5a4 4 0 018 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  unlock: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7V5a4 4 0 017.2-2.4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  eye: '<svg viewBox="0 0 16 16" fill="currentColor"><ellipse cx="8" cy="8" rx="6" ry="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>',
  'eye-off': '<svg viewBox="0 0 16 16" fill="currentColor"><ellipse cx="8" cy="8" rx="6" ry="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 2.5l11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

  // 文件系统
  folder: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h5l2 2h7v8H1z" fill="#e4a010" stroke="#a07010"/><path d="M1 3h5l2 2h7v8H1z" fill="none" stroke="currentColor"/></svg>',
  file: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h8l4 4v10H2z" fill="#fff" stroke="#808080"/><path d="M10 1v4h4" fill="none" stroke="#808080"/></svg>',
  image: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="6" r="1.5" fill="currentColor"/><path d="M1 12l4-4 3 3 4-5 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  video: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="4" width="10" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11 7l4-2v6l-4-2z" fill="currentColor"/></svg>',
  music: '<svg viewBox="0 0 16 16" fill="currentColor"><ellipse cx="5" cy="12" rx="2.5" ry="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M7.5 12V4l5-1.5v2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  document: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h8l4 4v10H2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 1v4h4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 8h8M4 11h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',

  // 通用界面
  user: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="5" r="3" fill="#808080"/><path d="M2 14c0-3 3-5 6-5s6 2 6 5" fill="#808080"/></svg>',
  star: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2 5h5l-4 3 1.5 5L8 10l-4.5 4 1.5-5-4-3h5z" fill="currentColor"/></svg>',
  menu: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" stroke-width="2"/></svg>',
  home: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L1 7h3v8h4V9h2v6h4V7h3z" fill="#808080" stroke="#404040"/></svg>',
  fullscreen: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  'fullscreen-exit': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 2v3H2M11 2v3h3M5 14v-3H2M11 14v-3h3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  heart: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 14S2 10 2 6a3 3 0 016 0 3 3 0 016 0c0 4-6 8-6 8z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  bell: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 12.5h10l-2-2V6c0-2.5-2-4-3-4S5 3.5 5 6v4.5l-2 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 13.5a2 2 0 004 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  calendar: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M1 6h14M4 2v3M12 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  clock: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5v4l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M1 4l7 5 7-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 1l2 2-1.5 2.5c1 1.5 2.5 3 4 4L9.5 8l2 2-1.5 2.5c-2 1-5-.5-7-2.5S1.5 4 4 1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  link: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 8.5a2.5 2.5 0 010-3.5l2-2a2.5 2.5 0 013.5 0M10.5 7.5a2.5 2.5 0 010 3.5l-2 2a2.5 2.5 0 01-3.5 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 10l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  tag: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 8l7-7h6v6l-7 7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="11" cy="5" r="1" fill="currentColor"/></svg>',
  bookmark: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h10v14L8 10.5 3 15z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  filter: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5l5 6v5l4 2v-7l5-6z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  sort: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 4v9M4 4l2 2M4 4L2 2M12 13V4m0 9l2-2m-2 2l-2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  grid: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="10" y="1" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="10" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="10" y="10" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  list: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="3" cy="4" r="1" fill="currentColor"/><circle cx="3" cy="8" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/></svg>',

  // 后台管理专用
  computer: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="5" y="11" width="6" height="2" fill="currentColor"/><rect x="6" y="13" width="4" height="1" fill="currentColor"/></svg>',
  logout: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 3H3v10h3M10 5l3 3-3 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  password: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7V5a4 4 0 018 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="10.5" r="1" fill="currentColor"/></svg>',
  cart: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 2h2l2 9h7l2-6H4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="13" r="1" fill="currentColor"/><circle cx="12" cy="13" r="1" fill="currentColor"/></svg>',
  'pie-chart': '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 2v6h6A6 6 0 008 2z" fill="currentColor"/></svg>',
  'bar-chart': '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="10" width="3" height="4" fill="currentColor"/><rect x="6.5" y="6" width="3" height="8" fill="currentColor"/><rect x="11" y="2" width="3" height="12" fill="currentColor"/></svg>',

  // 低代码平台菜单图标
  app: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  audit: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h9l3 3v9H2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="7.5" cy="7.5" r="3" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9.5 9.5l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  category: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="5" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="3" width="5" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="2" y="9" width="5" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="5" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  code: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 4l-3 4 3 4M11 4l3 4-3 4M9 2L7 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dashboard: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 9a6 6 0 1112 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 9V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 9l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  database: '<svg viewBox="0 0 16 16" fill="currentColor"><ellipse cx="8" cy="4" rx="6" ry="2.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 4v8c0 1.5 3 2.5 6 2.5s6-1 6-2.5V4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 8c0 1.5 3 2.5 6 2.5s6-1 6-2.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  dept: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="7" y="1" width="2" height="3" fill="currentColor"/><rect x="3" y="6" width="3" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="10" y="6" width="3" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 4v2M5.5 9v3M11.5 9v3M3 12.5h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  dict: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h7l3 3v10a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 1v4h4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 8h6M5 11h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  flow: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="5" width="4" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="5" width="4" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 8h3v-2l3 3-3 3V10H5" fill="currentColor"/></svg>',
  flowChart: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="4" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="2" width="4" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="5" y="10" width="6" height="3" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 5v2h5v1M13 5v2H8v1M8 10V8.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  log: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h10a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  market: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 6h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M2 6l2-4h8l2 4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v3M10 10v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  message: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6l-3 3V4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 7h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  model: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l7 3.5v7L8 15 1 11.5v-7L8 1z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M1 4.5L8 8l7-3.5M8 8v7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  monitor: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6 14h4M8 11v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M4 7l2.5 2.5L12 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  notice: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 11h10l-2-2V5c0-2-2-3.5-3-3.5S5 3 5 5v4l-2 2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6 12.5a2 2 0 004 0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  page: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h8l4 4v10H2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 1v4h4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 8h6M5 11h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  position: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 14c0-2.5 2.5-4.5 5-4.5s5 2 5 4.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M11 3l3-1v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  report: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h8l4 4v10H2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 1v4h4" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="5" y="9" width="3" height="4" fill="currentColor"/><rect x="9" y="7" width="3" height="6" fill="currentColor"/></svg>',
  reportList: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h12v14H2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M2 4h12" stroke="currentColor" stroke-width="0.8"/></svg>',
  role: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V4l6-3z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6 7l2 2 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  rule: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12M2 7h10M2 11h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M13 7v7M13 14l2-1.5M13 14l-2-1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  schedule: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 6h12M5 2v3M11 2v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 10l1.5-1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  server: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="10" height="11" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 6h10M3 10h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="5" cy="4" r="0.7" fill="currentColor"/><circle cx="5" cy="8" r="0.7" fill="currentColor"/><circle cx="5" cy="12" r="0.7" fill="currentColor"/></svg>',
  task: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  template: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h12v14H2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><rect x="5" y="5" width="6" height="4" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 11h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  validate: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',

  // 别名
  setting: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.3 4.3l1.4 1.4M10.3 10.3l1.4 1.4M4.3 11.7l1.4-1.4M10.3 5.7l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  chart: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="10" width="3" height="4" fill="currentColor"/><rect x="6.5" y="6" width="3" height="8" fill="currentColor"/><rect x="11" y="2" width="3" height="12" fill="currentColor"/></svg>'
}

const svgContent = computed(() => {
  let svg = props.svg || icons[props.name] || `<span style="font-size:12px">${props.name || 'icon'}</span>`
  if (props.color) svg = svg.replace(/fill="[^"]*"/g, `fill="${props.color}"`).replace(/stroke="[^"]*"/g, `stroke="${props.color}"`)
  return svg
})
</script>

<style scoped>
.w-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; color: var(--w-text-color-primary); }
.w-icon--small { width: 12px; height: 12px; }
.w-icon--large { width: 24px; height: 24px; }
</style>
