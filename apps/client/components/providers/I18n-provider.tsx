// components/providers/i18n-provider.tsx
"use client";

import { useEffect, useState } from "react";

import i18n from "@/lib/i18n"; // Fixed typo: was "i18nl"
import { I18nextProvider } from "react-i18next";

interface I18nProviderProps {
	children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);

		// Initialize i18n on client side and load saved language
		if (window) {
			const savedLanguage = localStorage.getItem("i18nextLng");
			if (savedLanguage && ["en", "fr"].includes(savedLanguage)) {
				i18n.changeLanguage(savedLanguage);
			}
		}
	}, []);

	// Prevent hydration mismatch by not rendering until client-side
	if (!isClient) {
		return <div>{children}</div>;
	}

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
