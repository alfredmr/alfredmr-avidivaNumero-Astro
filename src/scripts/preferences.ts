import { getLocale, initLocale, setLocale, t } from '../i18n';
import { applyTranslations } from './i18n-dom';

const THEME_KEY = 'theme';

export type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function resolveTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return getSystemTheme();
}

export function getTheme(): Theme {
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'light' ? 'light' : 'dark';
}

export function setTheme(theme: Theme, persist = true): void {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
        localStorage.setItem(THEME_KEY, theme);
    }
    const themeBtn = document.getElementById('btnThemeToggle');
    if (themeBtn) {
        themeBtn.setAttribute('aria-label', theme === 'dark' ? t('themeLight') : t('themeDark'));
    }
}

export function toggleTheme(): void {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

function setupSystemThemeListener(): void {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', () => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(getSystemTheme(), false);
        }
    });
}

function setupToolbar(): void {
    document.getElementById('btnLangEn')?.addEventListener('click', () => setLocale('en'));
    document.getElementById('btnLangEs')?.addEventListener('click', () => setLocale('es'));
    document.getElementById('btnThemeToggle')?.addEventListener('click', () => toggleTheme());
}

initLocale();
setTheme(resolveTheme(), false);
applyTranslations();
setupToolbar();
setupSystemThemeListener();

window.addEventListener('localechange', () => {
    applyTranslations();
});
