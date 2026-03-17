import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh.json'
import en from './locales/en.json'

// 获取保存的语言偏好，默认中文
const savedLanguage = localStorage.getItem('language') || 'zh'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false, // React已经处理了XSS
    },
  })

// 监听语言变化，保存到localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n

// 语言切换函数
export const changeLanguage = (lng: 'zh' | 'en') => {
  i18n.changeLanguage(lng)
}

// 获取当前语言
export const getCurrentLanguage = () => i18n.language

// 支持的语言列表
export const LANGUAGES = [
  { code: 'zh', name: '中文', nameEn: 'Chinese' },
  { code: 'en', name: 'English', nameEn: 'English' },
] as const