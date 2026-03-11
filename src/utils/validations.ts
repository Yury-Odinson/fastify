export const languages = ["en", "ru"] as const;
export type Language = typeof languages[number];

export const isValidLanguage = (lang: string): lang is Language => {
	return languages.includes(lang as Language);
};

export const isValidEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string): boolean => {
	return password.length >= 8;
};
