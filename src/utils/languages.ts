export const languages = ["en", "ru"] as const;
export type Language = typeof languages[number];

export const isValidLanguage = (lang: string): lang is Language => {
	return languages.includes(lang as Language);
};
