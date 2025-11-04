import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'en' || saved === 'es')) {
      return saved;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'es' || browserLang === 'en') ? browserLang : 'en';
  }
  
  return 'en'; // Default durante SSR
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        es: { translation: es }
      },
      lng: getInitialLanguage(),
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false 
      }
    });
}

export default i18n;