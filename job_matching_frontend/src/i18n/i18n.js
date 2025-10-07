import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import ar from './ar.json';

const resources = { en: { translation: en }, ar: { translation: ar } };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'cookie', 'querystring'],
      caches: ['localStorage']
    }
  });

// Set dir attribute on language change for RTL/LTR support
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lng);
});

// Initialize direction on load
const current = i18n.language || 'en';
document.documentElement.setAttribute('dir', current === 'ar' ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', current);

export default i18n;
