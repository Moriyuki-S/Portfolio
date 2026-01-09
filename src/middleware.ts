import { defineMiddleware } from 'astro:middleware';
import type { Lang } from './lib/i18n/type';

const parsePreferredLanguage = (acceptLanguage: string | null): Lang => {
    if (!acceptLanguage) return 'ja';
    const languages = acceptLanguage
        .split(',')
        .map((entry) => entry.split(';')[0]?.trim().toLowerCase())
        .filter(Boolean) as string[];

    const prefersJapanese = languages.some((lang) => lang.startsWith('ja'));
    return prefersJapanese ? 'ja' : 'en';
};

const parseLanguageFromCookie = (value: string | null): Lang | null => {
    if (!value) return null;
    return value === 'ja' || value === 'en' ? value : null;
};

const isEnglishPath = (pathname: string) =>
    pathname === '/en' || pathname.startsWith('/en/');

const buildRedirectTarget = (
    targetLang: Lang,
    pathname: string,
    search: string,
) => {
    if (targetLang === 'en') {
        const basePath = isEnglishPath(pathname)
            ? pathname
            : `/en${pathname === '/' ? '' : pathname}`;
        return `${basePath}${search}`;
    }

    const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
    return `${stripped}${search}`;
};

export const onRequest = defineMiddleware(async (context, next) => {
    const { request, url, redirect, locals, cookies } = context;
    const { pathname, search } = url;

    const currentLang: Lang = isEnglishPath(pathname) ? 'en' : 'ja';
    locals.lang = currentLang;

    const preferredLang =
        parseLanguageFromCookie(cookies.get('lang')?.value ?? null) ??
        parsePreferredLanguage(request.headers.get('accept-language'));
    const isRootPath = pathname === '/';

    if (isRootPath && preferredLang !== currentLang) {
        const target = buildRedirectTarget(preferredLang, pathname, search);
        if (target !== `${pathname}${search}`) {
            return redirect(target);
        }
    }

    return next();
});
