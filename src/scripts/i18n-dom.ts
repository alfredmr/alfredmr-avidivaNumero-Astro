import { getLocale, t, type TranslationKey } from '../i18n';

const HTML_KEYS = new Set<TranslationKey>(['configDesc', 'gameDesc', 'randomInfo', 'footerDev']);

export function applyTranslations(): void {
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n as TranslationKey | undefined;
        if (!key) return;
        const value = t(key);
        if (HTML_KEYS.has(key)) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    });

    const titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = t('pageTitle');

    document.getElementById('btnLangEn')?.classList.toggle('activo', getLocale() === 'en');
    document.getElementById('btnLangEs')?.classList.toggle('activo', getLocale() === 'es');

    const themeBtn = document.getElementById('btnThemeToggle');
    if (themeBtn) {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        themeBtn.setAttribute('aria-label', isDark ? t('themeLight') : t('themeDark'));
    }
}
