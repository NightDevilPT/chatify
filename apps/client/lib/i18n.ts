
// lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all language files
import enJSON from "../locale/en.json";
import frJSON from "../locale/fr.json";
import esJSON from "../locale/es.json";
import deJSON from "../locale/de.json";
import zhJSON from "../locale/zh.json";
import jaJSON from "../locale/ja.json";
import koJSON from "../locale/ko.json";
import hiJSON from "../locale/hi.json";
import ptJSON from "../locale/pt.json";
import itJSON from "../locale/it.json";
import thJSON from "../locale/th.json";
import viJSON from "../locale/vi.json";
import trJSON from "../locale/tr.json";

// Available languages with their details
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', rtl: false },
  fr: { name: 'Français', flag: '🇫🇷', rtl: false },
  es: { name: 'Español', flag: '🇪🇸', rtl: false },
  de: { name: 'Deutsch', flag: '🇩🇪', rtl: false },
  zh: { name: '中文', flag: '🇨🇳', rtl: false },
  ja: { name: '日本語', flag: '🇯🇵', rtl: false },
  ko: { name: '한국어', flag: '🇰🇷', rtl: false },
  hi: { name: 'हिन्दी', flag: '🇮🇳', rtl: false },
  pt: { name: 'Português', flag: '🇧🇷', rtl: false },
  it: { name: 'Italiano', flag: '🇮🇹', rtl: false },
  th: { name: 'ไทย', flag: '🇹🇭', rtl: false },
  vi: { name: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  tr: { name: 'Türkçe', flag: '🇹🇷', rtl: false },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const AVAILABLE_LANGUAGES = Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Get language from localStorage or default
const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('i18nextLng') as SupportedLanguage;
    if (storedLanguage && AVAILABLE_LANGUAGES.includes(storedLanguage)) {
      return storedLanguage;
    }
  }
  return DEFAULT_LANGUAGE;
};

const resources = {
  en: { translation: enJSON },
  fr: { translation: frJSON },
  es: { translation: esJSON },
  de: { translation: deJSON },
  zh: { translation: zhJSON },
  ja: { translation: jaJSON },
  ko: { translation: koJSON },
  hi: { translation: hiJSON },
  pt: { translation: ptJSON },
  it: { translation: itJSON },
  th: { translation: thJSON },
  vi: { translation: viJSON },
  tr: { translation: trJSON },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: getInitialLanguage(),
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },

    saveMissing: false,
  });

// Listen for language changes and update document direction for RTL languages
i18n.on('languageChanged', (lng: SupportedLanguage) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
    
    // Update document direction for RTL languages
    const isRTL = SUPPORTED_LANGUAGES[lng]?.rtl || false;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  }
});

export default i18n;