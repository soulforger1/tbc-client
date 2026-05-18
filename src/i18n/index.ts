import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import mn from './locales/mn'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    mn: { translation: mn },
  },
  lng: localStorage.getItem('language') ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
