import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
const resources = {
  en: {translation: en},
  hi: {translation: hi},
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
