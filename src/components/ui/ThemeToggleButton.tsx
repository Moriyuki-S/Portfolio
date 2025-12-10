import { cn } from '$lib/utils';
import { Button, Skeleton } from '@heroui/react';
import type { FC, ReactElement } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuMoon, LuSun } from 'react-icons/lu';
import { MdOutlineComputer } from 'react-icons/md';

export const ThemeToggleButton: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const [theme, setThemeState] = useState<'theme-light' | 'dark' | 'system'>(
        'theme-light',
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuCoords, setMenuCoords] = useState<{
        top: number;
        left: number;
    } | null>(null);
    const [menuPlacement, setMenuPlacement] = useState<'up' | 'down'>('down');
    const containerRef = useRef<HTMLDivElement>(null);
    const menuContentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setThemeState(isDarkMode ? 'dark' : 'theme-light');
        setLoading(false);
    }, []);

    useEffect(() => {
        const isDark =
            theme === 'dark' ||
            (theme === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
    }, [theme]);

    const handleThemeChange = (newTheme: 'theme-light' | 'dark' | 'system') => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
        setIsMenuOpen(false);
    };

    const iconClass = cn([
        'text-lg',
        'me-2',
        'text-default-500',
        'pointer-events-none',
        'flex-shrink-0',
    ]);

    const options: Array<{
        key: 'theme-light' | 'dark' | 'system';
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

    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                (menuContentRef.current?.contains(target))
            ) {
                return;
            }
            setIsMenuOpen(false);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        const handleScroll = () => setIsMenuOpen(false);
        const handleResize = () => setIsMenuOpen(false);

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [isMenuOpen]);

    useLayoutEffect(() => {
        if (!isMenuOpen) {
            setMenuCoords(null);
            return;
        }
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const rect = container.getBoundingClientRect();
        const prefersDropdown = window.matchMedia('(min-width: 768px)').matches;
        const offset = 8;
        setMenuPlacement(prefersDropdown ? 'down' : 'up');
        setMenuCoords({
            top: prefersDropdown ? rect.bottom + offset : rect.top - offset,
            left: rect.right,
        });
    }, [isMenuOpen]);

    return (
        <>
            <div className={cn(['relative', 'inline-flex'])} ref={containerRef}>
                <Button
                    data-astro-transition-persist="theme-toggle-button"
                    size="lg"
                    isIconOnly
                    className={cn(['flex', 'justify-center', 'p-2'])}
                    aria-label="Toggle Theme Change"
                    variant="bordered"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    onPress={() => setIsMenuOpen((open) => !open)}
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
            </div>
            {isMenuOpen &&
                menuCoords &&
                createPortal(
                    <div
                        ref={(node) => {
                            menuContentRef.current = node;
                        }}
                        role="menu"
                        className={cn(
                            [
                                'fixed',
                                'min-w-[190px]',
                                'rounded-2xl',
                                'border',
                                'border-default-200',
                                'bg-white/95',
                                'p-1',
                                'text-sm',
                                'shadow-2xl',
                                'backdrop-blur-xl',
                                'z-[80]',
                            ],
                            ['dark:border-default-100', 'dark:bg-slate-900/95'],
                        )}
                        style={{
                            top: menuCoords.top,
                            left: menuCoords.left,
                            transform:
                                menuPlacement === 'down'
                                    ? 'translateX(-100%)'
                                    : 'translate(-100%, -100%)',
                        }}
                    >
                        {options.map((option) => {
                            const isSelected = theme === option.key;
                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    role="menuitem"
                                    onClick={() =>
                                        handleThemeChange(option.key)
                                    }
                                    className={cn(
                                        [
                                            'flex',
                                            'w-full',
                                            'items-center',
                                            'rounded-xl',
                                            'px-3',
                                            'py-2',
                                            'text-left',
                                            'font-medium',
                                            'transition',
                                        ],
                                        isSelected
                                            ? [
                                                'bg-default-100',
                                                'text-default-900',
                                            ]
                                            : [
                                                'text-slate-600',
                                                'hover:bg-default',
                                                'hover:text-default-foreground',
                                            ],
                                        isSelected
                                            ? [
                                                'dark:bg-default-50/80',
                                                'dark:text-white',
                                            ]
                                            : ['dark:text-slate-200'],
                                    )}
                                >
                                    {option.icon}
                                    <span className={cn(['flex-1', 'text-sm'])}>
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>,
                    document.body,
                )}
            {isMenuOpen &&
                createPortal(
                    <button
                        type="button"
                        aria-label="Close theme menu overlay"
                        className={cn([
                            'fixed',
                            'inset-0',
                            'z-[70]',
                            'bg-slate-900/30',
                            'backdrop-blur-[1px]',
                        ])}
                        onClick={() => setIsMenuOpen(false)}
                    />,
                    document.body,
                )}
        </>
    );
};
