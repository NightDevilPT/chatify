// utils/language.ts (Optional: Helper functions for language management)
export const SUPPORTED_LANGUAGES = {
	en: "English",
	fr: "Français",
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const getStoredLanguage = (): SupportedLanguage => {
	if (typeof window === "undefined") return "en";

	const stored = localStorage.getItem("i18nextLng") as SupportedLanguage;
	return stored && stored in SUPPORTED_LANGUAGES ? stored : "en";
};

export const setStoredLanguage = (language: SupportedLanguage): void => {
	if (typeof window === "undefined") return;

	localStorage.setItem("i18nextLng", language);
};

export const isValidLanguage = (lang: string): lang is SupportedLanguage => {
	return lang in SUPPORTED_LANGUAGES;
};
