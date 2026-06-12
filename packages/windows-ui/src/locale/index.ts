import { inject, computed, type InjectionKey, type Ref } from 'vue'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'

export type LocaleKey = string
export type LocaleMessages = Record<string, string>
export type LocaleType = 'zh-CN' | 'en-US' | LocaleKey

const localeMap: Record<string, LocaleMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

let globalLocale: LocaleType = 'zh-CN'
let globalMessages: LocaleMessages = { ...zhCN }

export function registerLocale(lang: LocaleType, messages: LocaleMessages) {
  localeMap[lang] = messages
}

export function setGlobalLocale(lang: LocaleType) {
  globalLocale = lang
  globalMessages = localeMap[lang] || {}
}

export function getGlobalLocale(): LocaleType {
  return globalLocale
}

export function getLocaleMessages(lang: LocaleType): LocaleMessages {
  return localeMap[lang] || {}
}

export interface LocaleContext {
  locale: Ref<LocaleType>
  messages: Ref<LocaleMessages>
}

export const localeContextKey: InjectionKey<LocaleContext> = Symbol('localeContextKey')

export function useLocale() {
  const context = inject(localeContextKey, undefined)

  const locale = computed<LocaleType>(() => context?.locale.value || globalLocale)
  const messages = computed<LocaleMessages>(() => context?.messages.value || globalMessages)

  function t(key: string, params?: Record<string, string | number>): string {
    const currentGlobal = getLocaleMessages(getGlobalLocale())
    let text = messages.value[key] || currentGlobal[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      })
    }
    return text
  }

  return {
    locale,
    messages,
    t
  }
}

export { zhCN, enUS }
