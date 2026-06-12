import { inject, computed, type InjectionKey, type Ref } from 'vue'
import type { LocaleType, LocaleMessages } from '../locale'

export interface ConfigProviderConfig {
  prefix: string
  size: string
  zIndex: number
  locale: LocaleType | LocaleMessages
}

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderConfig>> = Symbol('configProviderContextKey')

let globalPrefix = 'w'

export function setGlobalPrefix(prefix: string) {
  globalPrefix = prefix
}

export function usePrefix() {
  const config = inject(configProviderContextKey, undefined)
  const prefix = config?.value?.prefix || globalPrefix

  function withPrefix(name: string) {
    return `${prefix}-${name}`
  }

  return {
    prefix,
    withPrefix
  }
}

export function useGlobalSize() {
  const config = inject(configProviderContextKey, undefined)
  return computed(() => (config?.value?.size as string) || 'default')
}
