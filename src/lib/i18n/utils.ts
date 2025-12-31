import { navigate } from 'astro:transitions/client';
import { useEffect, useState } from 'react';
import type { Lang, Multilingual } from './type';

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
            setCurrentLang(getLangFromPath(window.location.pathname));
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
        navigate(nextUrl);
    };

    return { currentLang, switchLanguage };
};
