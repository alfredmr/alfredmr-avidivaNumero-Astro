import { en, type TranslationKey } from './en';
import { es } from './es';

export type Locale = 'en' | 'es';

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, es };

const LOCALE_KEY = 'locale';
const DEFAULT_LOCALE: Locale = 'en';

let currentLocale: Locale = DEFAULT_LOCALE;

function readStoredLocale(): Locale {
    if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;
    const stored = localStorage.getItem(LOCALE_KEY);
    return stored === 'es' ? 'es' : DEFAULT_LOCALE;
}

export function getLocale(): Locale {
    return currentLocale;
}

export function setLocale(locale: Locale): void {
    if (locale === currentLocale) return;
    currentLocale = locale;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCALE_KEY, locale);
    }
    if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
    }
    window.dispatchEvent(new CustomEvent('localechange'));
}

export function initLocale(): void {
    currentLocale = readStoredLocale();
    if (typeof document !== 'undefined') {
        document.documentElement.lang = currentLocale;
    }
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
    let text = dictionaries[currentLocale][key] ?? dictionaries.en[key] ?? key;
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
        }
    }
    return text;
}

export type { TranslationKey };
