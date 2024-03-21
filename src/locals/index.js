// index.js
import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const messages = {
  en,
  zh,
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || navigator.language || 'zh-CN',
  // locale: 'en', // 默认显示语言
  messages: {
    'zh-CN': zh,
    'en': en
  }
})
export default i18n

