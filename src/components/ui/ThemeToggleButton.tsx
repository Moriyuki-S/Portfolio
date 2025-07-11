import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Skeleton,
} from '@heroui/react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { MdOutlineComputer } from 'react-icons/md';

export const ThemeToggleButton: FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const [theme, setThemeState] = useState<'theme-light' | 'dark' | 'system'>(
        'theme-light',
    );

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
    };

    const iconClass =
        'text-lg me-2 text-default-500 pointer-events-none flex-shrink-0';

    return (
        <Dropdown backdrop="blur">
            <DropdownTrigger>
                <Button
                    size="lg"
                    isIconOnly
                    className="p-2 flex justify-center"
                    aria-label="Toggle Theme Change"
                    variant="bordered"
                >
                    {loading ? (
                        <Skeleton className="w-6 h-6 rounded-sm" />
                    ) : theme === 'dark' ? (
                        <LuMoon className="w-6 h-6" />
                    ) : theme === 'system' ? (
                        <MdOutlineComputer className="w-6 h-6" />
                    ) : (
                        <LuSun className="w-6 h-6" />
                    )}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Theme Toggle Menu">
                <DropdownItem
                    startContent={<LuSun className={iconClass} />}
                    key="light"
                    onClick={() => handleThemeChange('theme-light')}
                >
                    ライトモード
                </DropdownItem>
                <DropdownItem
                    startContent={<LuMoon className={iconClass} />}
                    key="dark"
                    onClick={() => handleThemeChange('dark')}
                >
                    ダークモード
                </DropdownItem>
                <DropdownItem
                    startContent={<MdOutlineComputer className={iconClass} />}
                    key="system"
                    className="text-lg"
                    onClick={() => handleThemeChange('system')}
                >
                    システム
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};
