import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files for each language
import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';

// Define the translations for each language
const resources = {
    en: { translation: translationEN },
    hi: { translation: translationHI }
};

i18n
    .use(initReactI18next) // Passes i18n instance to react-i18next
    .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language if translation is missing
        keySeparator: false, // We do not use keys in the form messages.welcome
        interpolation: {
            escapeValue: false, // React already escapes from XSS
        },
    });

export default i18n;
