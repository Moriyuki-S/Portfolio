import { showLanguageTransition } from '$lib/i18n/LanguageTransitionOverlay';
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
    initialLang?: Lang;
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
    className,
    compact = false,
    initialLang,
}) => {
    const { currentLang, switchLanguage } = useLanguagePreference(initialLang);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectionChange = (keys: Selection) => {
        if (keys === 'all') return;

        const nextLang = Array.from(keys).at(0) as Lang | undefined;
        if (!nextLang) return;

        setIsOpen(false);

        if (nextLang !== currentLang) {
            showLanguageTransition(nextLang, () => {
                switchLanguage(nextLang);
            });
        } else {
            switchLanguage(nextLang);
        }
    };

    const selectedKeys = useMemo(
        () => new Set([currentLang]) as Selection,
        [currentLang],
    );

    const options: Array<{ key: Lang; label: string; icon: ReactElement }> = [
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
                    className={cn('flex items-center gap-2 px-3', className)}
                    aria-label={
                        currentLang === 'ja'
                            ? '言語を切り替える'
                            : 'Switch language'
                    }
                    endContent={<LuLanguages className="h-4 w-4" />}
                >
                    {currentLang === 'ja' ? '日本語' : 'English'}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Language selection"
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={handleSelectionChange}
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
