import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files using dynamic import
const loadTranslations = async () => {
  const enTranslations = await import('./public/locales/en/translation.json');
  const fiTranslations = await import('./public/locales/fi/translation.json');
  return {
    en: { translation: enTranslations },
    fi: { translation: fiTranslations },
  };
};

loadTranslations().then((resources) => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: resources,
      lng: 'en', // default language
      fallbackLng: 'en', // fallback language
      interpolation: {
        escapeValue: false, // react already does escaping
      },
    });
});

export default i18n;
