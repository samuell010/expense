import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

// Type for translation resources
interface TranslationResources {
  en: {
    translation: Record<string, string>;
  };
  fi: {
    translation: Record<string, string>;
  };
}

// Import translation files using dynamic import with type annotations
const loadTranslations = async (): Promise<TranslationResources> => {
  const enTranslations = await import('./public/locales/en/translation.json');
  const fiTranslations = await import('./public/locales/fi/translation.json');

  return {
    en: { translation: enTranslations.default },
    fi: { translation: fiTranslations.default },
  };
};

// Initialize i18n with loaded translations and configuration
loadTranslations().then((resources) => {
  i18n
    .use(initReactI18next)
    .init<TranslationResources>({
      resources: resources,
      lng: 'en', // default language
      fallbackLng: 'en', // fallback language
      interpolation: {
        escapeValue: false, // react already does escaping
      },
    } as InitOptions);
});

export default i18n;
