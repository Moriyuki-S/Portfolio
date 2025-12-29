import { useLanguagePreference } from '$lib/i18n/utils';
import { cn } from '$lib/utils';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    type Selection,
} from '@heroui/react';
import { type FC, type ReactElement, useMemo, useState } from 'react';
import { LuLanguages } from 'react-icons/lu';
import type { Lang } from 'src/lib/i18n/type';

type LanguageSwitcherProps = {
    className?: string;
    compact?: boolean;
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
    className,
    compact = false,
}) => {
    const { currentLang, switchLanguage } = useLanguagePreference();
    const [isOpen, setIsOpen] = useState(false);

    const options: Array<{
        key: Lang;
        label: string;
        icon: ReactElement;
    }> = [
        {
            key: 'ja',
            label: '日本語',
            icon: (
                <span className="font-semibold text-default-500 text-xs">
                    JA
                </span>
            ),
        },
        {
            key: 'en',
            label: 'English',
            icon: (
                <span className="font-semibold text-default-500 text-xs">
                    EN
                </span>
            ),
        },
    ];

    const selectedKeys = useMemo(
        () => new Set([currentLang]) as Selection,
        [currentLang],
    );

    return (
        <Dropdown
            placement="bottom-end"
            isOpen={isOpen}
            onOpenChange={setIsOpen}
        >
            <DropdownTrigger>
                <Button
                    size={compact ? 'sm' : 'md'}
                    variant="bordered"
                    className={cn(
                        ['flex', 'items-center', 'gap-2', 'px-3'],
                        className,
                    )}
                    aria-label="言語を切り替える"
                    endContent={<LuLanguages className={cn(['h-4', 'w-4'])} />}
                >
                    {currentLang === 'ja' ? '日本語' : 'English'}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="言語選択"
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={(keys) => {
                    if (keys === 'all') return;
                    const next = Array.from(keys).at(0) as Lang | undefined;
                    if (next) {
                        setIsOpen(false);
                        switchLanguage(next);
                    }
                }}
            >
                {options.map((option) => (
                    <DropdownItem key={option.key} startContent={option.icon}>
                        {option.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};
