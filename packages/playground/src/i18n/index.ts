import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

const savedLang = localStorage.getItem('playground_lang') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n

export function setPlaygroundLang(lang: 'zh-CN' | 'en-US') {
  localStorage.setItem('playground_lang', lang)
  i18n.global.locale.value = lang
}
