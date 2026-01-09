import { cn } from '$lib/utils';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    type Selection,
    Skeleton,
} from '@heroui/react';
import type { FC, ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { MdOutlineComputer } from 'react-icons/md';

type ThemeOption = 'theme-light' | 'dark' | 'system';

const isDarkTheme = (theme: ThemeOption) =>
    theme === 'dark' ||
    (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

const applyTheme = (theme: ThemeOption) => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList[isDarkTheme(theme) ? 'add' : 'remove'](
        'dark',
    );
    try {
        localStorage.setItem('theme', theme);
    } catch {
        /* ignore */
    }
};

const readStoredTheme = (): ThemeOption | null => {
    try {
        const stored = localStorage.getItem('theme');
        if (
            stored === 'dark' ||
            stored === 'theme-light' ||
            stored === 'system'
        )
            return stored;
        return null;
    } catch {
        return null;
    }
};

const resolveInitialTheme = (): ThemeOption => {
    if (typeof document === 'undefined') return 'theme-light';
    const stored = readStoredTheme();
    if (stored) return stored;
    const hasDarkClass = document.documentElement.classList.contains('dark');
    return hasDarkClass ? 'dark' : 'theme-light';
};

const iconClass = cn([
    'text-lg',
    'me-2',
    'text-default-500',
    'pointer-events-none',
    'flex-shrink-0',
]);

const options: Array<{
    key: ThemeOption;
    label: string;
    icon: ReactElement;
}> = [
    {
        key: 'theme-light',
        label: 'ライトモード',
        icon: <LuSun className={iconClass} />,
    },
    {
        key: 'dark',
        label: 'ダークモード',
        icon: <LuMoon className={iconClass} />,
    },
    {
        key: 'system',
        label: 'システム',
        icon: <MdOutlineComputer className={iconClass} />,
    },
];

export const ThemeToggleButton: FC = () => {
    const [theme, setTheme] = useState<ThemeOption>(() =>
        resolveInitialTheme(),
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        applyTheme(theme);
        setLoading(false);
    }, [theme]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (event: MediaQueryListEvent) => {
            if (theme === 'system') {
                document.documentElement.classList[
                    event.matches ? 'add' : 'remove'
                ]('dark');
            }
        };
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, [theme]);

    const selectedKeys = useMemo(() => new Set([theme]) as Selection, [theme]);

    const handleSelectionChange = (keys: Selection) => {
        if (keys === 'all') return;
        const next = Array.from(keys).at(0) as ThemeOption | undefined;
        if (next) {
            setTheme(next);
        }
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Button
                    data-astro-transition-persist="theme-toggle-button"
                    size="lg"
                    isIconOnly
                    className={cn(['flex', 'justify-center', 'p-2'])}
                    aria-label="テーマを切り替える"
                    variant="bordered"
                >
                    {loading ? (
                        <Skeleton
                            className={cn(['h-6', 'w-6', 'rounded-sm'])}
                        />
                    ) : theme === 'dark' ? (
                        <LuMoon className={cn(['h-6', 'w-6'])} />
                    ) : theme === 'system' ? (
                        <MdOutlineComputer className={cn(['h-6', 'w-6'])} />
                    ) : (
                        <LuSun className={cn(['h-6', 'w-6'])} />
                    )}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="テーマ選択"
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={handleSelectionChange}
                variant="solid"
            >
                {options.map((option) => (
                    <DropdownItem
                        key={option.key}
                        startContent={option.icon}
                        className={cn(['text-sm', 'font-medium'])}
                    >
                        {option.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};
