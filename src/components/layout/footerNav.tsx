import { cn } from '$lib/utils';
import {
    Button,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import { LucideCircleUser, LucideCode, LucideHome } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';
import { LuGithub, LuLinkedin, LuMenu } from 'react-icons/lu';
import type { Lang } from 'src/lib/i18n/type';
import { useLanguagePreference, useTranslations } from 'src/lib/i18n/utils';
import { AnimatedLogo } from '../ui/AnimatedLogo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggleButton } from '../ui/ThemeToggleButton';

type FooterNavProps = {
    initialLang?: Lang;
};

const TEXT = {
    toc: { ja: '目次', en: 'Menu' },
    close: { ja: '閉じる', en: 'Close' },
    home: { ja: 'ホーム', en: 'Home' },
    profile: { ja: 'プロフィール', en: 'Profile' },
    project: { ja: 'プロジェクト', en: 'Projects' },
};

export const FooterNav: FC<FooterNavProps> = ({ initialLang }) => {
    const { currentLang } = useLanguagePreference(initialLang);
    const t = useTranslations(currentLang);

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const scrollRef = useRef({ lastY: 0, ticking: false });

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
        setIsHidden(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current || scrollRef.current.ticking) {
                return;
            }
            scrollRef.current.ticking = true;
            const current = window.scrollY;
            window.requestAnimationFrame(() => {
                const last = scrollRef.current.lastY;
                const delta = current - last;

                if (!isMenuOpen) {
                    if (delta > 6) {
                        setIsHidden(true);
                    } else if (delta < -6) {
                        setIsHidden(false);
                    }
                } else {
                    setIsHidden(false);
                }

                scrollRef.current.lastY = current < 0 ? 0 : current;
                scrollRef.current.ticking = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMenuOpen]);

    return (
        <>
            <footer
                className={cn(
                    [
                        'w-full',
                        'h-auto',
                        'fixed',
                        'bottom-0',
                        'z-40',
                        'px-5',
                        'py-4',
                        'transition-transform',
                        'duration-500',
                        'ease-[cubic-bezier(0.4,0,0.2,1)]',
                        isHidden ? 'translate-y-full' : 'translate-y-0',
                    ],
                    ['border-t', 'bg-white'],
                    ['dark:bg-black'],
                    ['md:hidden'],
                )}
            >
                <div
                    className={cn([
                        'flex',
                        'w-full',
                        'justify-between',
                        'items-center',
                        'gap-2',
                    ])}
                >
                    <div className={cn(['flex'])}>
                        <AnimatedLogo />
                    </div>
                    <div
                        className={cn([
                            'flex',
                            'items-center',
                            'gap-4',
                            'flex-wrap',
                            'justify-end',
                        ])}
                    >
                        <div className="flex items-center gap-5">
                            <a
                                href="https://github.com/Moriyuki-S"
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="GitHub"
                                className="text-slate-700 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                            >
                                <LuGithub className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/moriyuki-suzuki/"
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="LinkedIn"
                                className="text-slate-700 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                            >
                                <LuLinkedin className="h-5 w-5" />
                            </a>
                        </div>
                        <ThemeToggleButton />
                        <button type="button" onClick={handleMenuToggle}>
                            <LuMenu size={24} />
                        </button>
                    </div>
                </div>
            </footer>

            <Modal
                isOpen={isMenuOpen}
                backdrop="blur"
                onClose={handleMenuToggle}
            >
                <ModalContent>
                    <ModalHeader>{t(TEXT.toc)}</ModalHeader>
                    <ModalBody>
                        <ul
                            className={cn(
                                [
                                    'flex',
                                    'flex-col',
                                    'items-center',
                                    'gap-4',
                                    'justify-center',
                                ],
                                ['[&>li]:w-40', '[&>li]:leading-7'],
                            )}
                        >
                            <li>
                                <Link
                                    href="/"
                                    className={cn(['h-full', 'flex'])}
                                    onClick={handleMenuToggle}
                                >
                                    <LucideHome className="me-3" />
                                    {t(TEXT.home)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#profile"
                                    onClick={handleMenuToggle}
                                    className={cn(['h-full', 'flex'])}
                                >
                                    <LucideCircleUser className="me-3" />
                                    {t(TEXT.profile)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#project"
                                    onClick={handleMenuToggle}
                                    className={cn(['h-full', 'flex'])}
                                >
                                    <LucideCode className="me-3" />
                                    {t(TEXT.project)}
                                </Link>
                            </li>
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex w-full items-center justify-between">
                            <LanguageSwitcher initialLang={initialLang} />
                            <Button color="danger" onPress={handleMenuToggle}>
                                {t(TEXT.close)}
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
