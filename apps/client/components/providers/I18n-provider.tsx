// components/providers/i18n-provider.tsx
"use client";

import { useEffect, useState } from "react";
import i18n from "@/lib/i18n";
import { I18nextProvider } from "react-i18next";

interface I18nProviderProps {
	children: React.ReactNode;
	lng?: string; // Add this prop to receive initial language from server
}

export function I18nProvider({ children, lng }: I18nProviderProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		// Only run on client side
		if (typeof window !== "undefined") {
			const savedLanguage = localStorage.getItem("i18nextLng");
			const availableLanguages = [
				"de",
				"en",
				"es",
				"fr",
				"hi",
				"it",
				"ja",
				"ko",
				"pt",
				"th",
				"tr",
				"vi",
				"zh",
			];

			// Use saved language if valid, otherwise fallback to server-provided language or default
			const languageToUse = availableLanguages.includes(
				savedLanguage || ""
			)
				? savedLanguage
				: lng || i18n.options.lng || "en";

			if (languageToUse && i18n.language !== languageToUse) {
				i18n.changeLanguage(languageToUse);
			}
		}
	}, [lng]);

	// Important: Render nothing or a loader until mounted to avoid hydration mismatch
	if (!mounted) {
		return null;
	}

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
