import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
}

export type BreakpointKey = keyof typeof breakpoints

export function useScreen() {
  const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

  const update = () => {
    screenWidth.value = window.innerWidth
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  const isMobile = computed(() => screenWidth.value <= breakpoints.md)
  const isTablet = computed(() => screenWidth.value > breakpoints.md && screenWidth.value <= breakpoints.lg)
  const isDesktop = computed(() => screenWidth.value > breakpoints.lg)
  const isSmallScreen = computed(() => screenWidth.value <= breakpoints.sm)

  return {
    screenWidth,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen
  }
}

export function useMediaQuery(maxWidth: number) {
  const matches = ref(false)

  const update = () => {
    matches.value = window.innerWidth <= maxWidth
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  return matches
}

export function useMobile() {
  return useMediaQuery(breakpoints.md)
}
