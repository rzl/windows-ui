import { inject, computed, ref, type InjectionKey, type Ref, type App } from 'vue'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'

export type LocaleKey = string
export type LocaleMessages = Record<string, string>
export type LocaleType = 'zh-CN' | 'en-US' | LocaleKey

const localeMap: Record<string, LocaleMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const globalLocale = ref<LocaleType>('zh-CN')
const globalMessages = ref<LocaleMessages>({ ...zhCN })

export function registerLocale(lang: LocaleType, messages: LocaleMessages) {
  localeMap[lang] = messages
}

export function setGlobalLocale(lang: LocaleType) {
  globalLocale.value = lang
  globalMessages.value = localeMap[lang] || {}
}

export function getGlobalLocale(): LocaleType {
  return globalLocale.value
}

export function getLocaleMessages(lang: LocaleType): LocaleMessages {
  return localeMap[lang] || {}
}

export interface LocaleContext {
  locale: Ref<LocaleType>
  messages: Ref<LocaleMessages>
}

export const lowcodeLocaleContextKey: InjectionKey<LocaleContext> = Symbol('lowcodeLocaleContextKey')

export function useLowcodeLocale() {
  const context = inject(lowcodeLocaleContextKey, undefined)

  const locale = computed<LocaleType>(() => context?.locale.value || globalLocale.value)
  const messages = computed<LocaleMessages>(() => context?.messages.value || globalMessages.value)

  function t(key: string, params?: Record<string, string | number>): string {
    const currentMessages = messages.value
    let text = currentMessages[key] || key
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

export function createLowcodeI18n(options?: { locale?: LocaleType; messages?: LocaleMessages }) {
  return {
    install(app: App) {
      const currentLocale = options?.locale || 'zh-CN'
      if (options?.messages) {
        registerLocale(currentLocale, options.messages)
      }
      setGlobalLocale(currentLocale)

      const localeRef = computed(() => globalLocale.value)
      const messagesRef = computed(() => globalMessages.value)
      app.provide(lowcodeLocaleContextKey, { locale: localeRef, messages: messagesRef })
    }
  }
}

export { zhCN, enUS }
