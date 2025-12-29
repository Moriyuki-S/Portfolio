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
    const { request, url, redirect, locals } = context;
    const { pathname, search } = url;

    const currentLang: Lang = isEnglishPath(pathname) ? 'en' : 'ja';
    locals.lang = currentLang;

    const preferredLang = parsePreferredLanguage(
        request.headers.get('accept-language'),
    );
    const isRootLike =
        pathname === '/' || pathname === '/en' || pathname === '/en/';

    if (isRootLike && preferredLang !== currentLang) {
        const target = buildRedirectTarget(preferredLang, pathname, search);
        if (target !== `${pathname}${search}`) {
            return redirect(target);
        }
    }

    return next();
});
