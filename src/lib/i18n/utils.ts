import { navigate } from 'astro:transitions/client';
import { useEffect, useState } from 'react';
import type { Lang, Multilingual } from './type';

const LANGUAGE_COOKIE_KEY = 'lang';
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const persistLanguagePreference = (lang: Lang) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${LANGUAGE_COOKIE_KEY}=${lang}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; SameSite=Lax`;
};

const stripEnPrefix = (pathname: string) =>
    pathname.replace(/^\/en(?=\/|$)/, '') || '/';

const getLangFromPath = (pathname: string): Lang =>
    pathname.startsWith('/en') ? 'en' : 'ja';

export const buildLanguagePath = (target: Lang, location: Location) => {
    const { pathname, search, hash } = location;

    let basePath = pathname;
    if (target === 'en') {
        basePath = pathname.startsWith('/en')
            ? pathname
            : `/en${pathname === '/' ? '' : pathname}`;
    } else if (pathname.startsWith('/en')) {
        basePath = stripEnPrefix(pathname);
    }

    return `${basePath}${search}${hash}`;
};

export function useTranslations(lang: Lang) {
    return function t(multilingual: Multilingual): string {
        return multilingual[lang];
    };
};

export const useLanguagePreference = (initialLang?: Lang) => {
    const [currentLang, setCurrentLang] = useState<Lang>(() =>
        typeof window === 'undefined'
            ? initialLang ?? 'ja'
            : getLangFromPath(window.location.pathname),
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const updateLanguageFromPath = () => {
            const lang = getLangFromPath(window.location.pathname);
            setCurrentLang(lang);
            persistLanguagePreference(lang);
        };

        updateLanguageFromPath();
        window.addEventListener('popstate', updateLanguageFromPath);
        return () =>
            window.removeEventListener('popstate', updateLanguageFromPath);
    }, []);

    const switchLanguage = (target: Lang) => {
        if (typeof window === 'undefined') return;
        const nextUrl = buildLanguagePath(target, window.location);
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

        if (nextUrl === currentUrl) {
            return;
        }

        setCurrentLang(target);
        persistLanguagePreference(target);
        navigate(nextUrl);
    };

    return { currentLang, switchLanguage };
};
