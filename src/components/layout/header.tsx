import { cn } from '$lib/utils';
import { navigate } from 'astro:transitions/client';
import {
    type FC,
    type MouseEvent,
    type ReactElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    LuCircle,
    LuCode,
    LuGithub,
    LuHouse,
    LuLinkedin,
    LuMenu,
    LuSend,
    LuX,
} from 'react-icons/lu';
import { SocialIconButton } from '../ui/SocialIconButton';
import { ThemeToggleButton } from '../ui/ThemeToggleButton';
import { AnimatedLogo } from '../ui/AnimatedLogo';

const socialIconClasses = cn(['relative', 'z-10', 'h-5', 'w-5']);
const navButtonClasses = ['nav-link'];

type NavItem = {
    id: string;
    label: string;
    href: string;
    icon: ReactElement;
    useNavigate?: boolean;
};

const navItems: NavItem[] = [
    {
        id: 'home',
        label: 'ホーム',
        href: '/',
        icon: <LuHouse />,
        useNavigate: true,
    },
    {
        id: 'profile',
        label: 'プロフィール',
        href: '/#profile',
        icon: <LuCircle />,
    },
    {
        id: 'project',
        label: 'プロジェクト',
        href: '/#project',
        icon: <LuCode />,
    },
    {
        id: 'contact',
        label: 'お問い合わせ',
        href: '/contact',
        icon: <LuSend />,
        useNavigate: true,
    },
];

export const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [currentPath, setCurrentPath] = useState<string>('/');
    const [activeSection, setActiveSection] = useState<string>('home');
    const [isHidden, setIsHidden] = useState(false);
    const scrollRef = useRef({
        lastY: 0,
        ticking: false,
    });

    useEffect(() => {
        setCurrentPath(window.location.pathname);
        const onPopState = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

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
                    if (current > 120 && delta > 6) {
                        setIsHidden(true);
                    } else if (delta < -6 || current <= 120) {
                        setIsHidden(false);
                    }
                } else {
                    setIsHidden(false);
                }

                scrollRef.current.lastY = current < 0 ? 0 : current;
                scrollRef.current.ticking = false;
            });
        };

        const onScroll = () => {
            handleScroll();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isMenuOpen]);

    useEffect(() => {
        if (currentPath !== '/') {
            setActiveSection(
                currentPath.startsWith('/contact') ? 'contact' : 'home',
            );
            return;
        }

        const sectionSelectors: Array<{ id: string; selector: string }> = [
            { id: 'profile', selector: '#profile' },
            { id: 'project', selector: '#project' },
        ];

        const detectSection = () => {
            const scrollY = window.scrollY + window.innerHeight * 0.3;
            let nextSection = 'home';

            for (const section of sectionSelectors) {
                const element = document.querySelector(section.selector);
                if (!element) continue;
                const top =
                    element.getBoundingClientRect().top + window.scrollY;
                if (scrollY >= top) {
                    nextSection = section.id;
                }
            }

            setActiveSection(nextSection);
        };

        detectSection();
        window.addEventListener('scroll', detectSection, { passive: true });

        return () => window.removeEventListener('scroll', detectSection);
    }, [currentPath]);

    const navigateWithAnimation = (e: MouseEvent, href: string) => {
        e.preventDefault();
        const currentPath = window.location.pathname;
        if (currentPath === href) {
            return;
        }
        navigate(href);
        setCurrentPath(href);
    };

    const handleNavClick = (
        item: NavItem,
        event: MouseEvent<HTMLAnchorElement>,
    ) => {
        if (item.id === 'home') {
            event.preventDefault();
            if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                navigateWithAnimation(event, item.href);
            }
        } else if (item.useNavigate) {
            navigateWithAnimation(event, item.href);
        } else if (item.href.startsWith('/#')) {
            event.preventDefault();
            const url = new URL(item.href, window.location.origin);
            if (window.location.pathname !== '/') {
                navigateWithAnimation(event, url.pathname);
                setTimeout(() => {
                    scrollToSection(url.hash);
                }, 350);
            } else {
                scrollToSection(url.hash);
            }
        }
        setIsMenuOpen(false);
    };

    const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (window.location.pathname !== '/') {
            navigateWithAnimation(event, '/');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const isActive = (item: NavItem) => activeSection === item.id;

    const navList = navItems.map((item) => (
        <li key={item.id}>
            <a
                href={item.href}
                className={cn(navButtonClasses, {
                    'nav-link--active': isActive(item),
                })}
                onClick={(event) => handleNavClick(item, event)}
            >
                <span className={cn(['nav-link__icon'])}>{item.icon}</span>
                <span>{item.label}</span>
            </a>
        </li>
    ));

    return (
        <header
            className={cn(
                [
                    'hidden',
                    'sticky',
                    'top-0',
                    'z-50',
                    'w-full',
                    'bg-white/80',
                    'backdrop-blur-2xl',
                    'shadow-[0_10px_40px_rgba(15,23,42,0.08)]',
                    'transition-transform',
                    'duration-500',
                    'ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isHidden ? '-translate-y-full' : 'translate-y-0',
                ],
                ['md:block'],
                ['dark:bg-slate-950/70'],
            )}
            style={{ transformOrigin: 'top' }}
        >
            <div
                className={cn(
                    [
                        'relative',
                        'mx-auto',
                        'flex',
                        'w-full',
                        'items-center',
                        'justify-between',
                        'px-4',
                        'py-3',
                    ],
                    ['md:px-24'],
                )}
            >
                <a
                    href="/"
                    className={cn(['inline-flex'])}
                    aria-label="Scroll to top"
                    onClick={handleLogoClick}
                >
                    <AnimatedLogo className={cn(['cursor-pointer'])} />
                </a>

                <nav
                    className={cn(
                        ['hidden', 'items-center', 'gap-3'],
                        ['md:flex'],
                        ['lg:gap-4'],
                    )}
                >
                    <ul
                        className={cn(
                            [
                                'flex',
                                'items-center',
                                'gap-2',
                                'text-sm',
                                'font-semibold',
                                'text-slate-600',
                            ],
                            ['dark:text-slate-200'],
                        )}
                    >
                        {navList}
                    </ul>
                </nav>

                <div
                    className={cn(
                        ['hidden', 'items-center', 'gap-4'],
                        ['md:flex'],
                    )}
                >
                    <SocialIconButton
                        href="https://github.com/"
                        ariaLabel="GitHub"
                        icon={<LuGithub className={socialIconClasses} />}
                    />
                    <SocialIconButton
                        href="https://www.linkedin.com/"
                        ariaLabel="LinkedIn"
                        icon={<LuLinkedin className={socialIconClasses} />}
                    />
                    <ThemeToggleButton />
                </div>

                <button
                    type="button"
                    className={cn(
                        [
                            'flex',
                            'h-12',
                            'w-12',
                            'items-center',
                            'justify-center',
                            'rounded-full',
                            'border',
                            'border-slate-200',
                            'bg-white',
                            'text-slate-900',
                            'transition',
                            'hover:bg-slate-100',
                        ],
                        [
                            'dark:border-slate-700',
                            'dark:bg-slate-900',
                            'dark:text-white',
                            'dark:hover:bg-slate-800',
                        ],
                        ['md:hidden'],
                    )}
                    aria-label={
                        isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'
                    }
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                    {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                </button>
            </div>

            <div
                className={cn(
                    [
                        'transition-[max-height]',
                        'duration-500',
                        'ease-[cubic-bezier(0.4,0,0.2,1)]',
                        isMenuOpen ? 'max-h-[400px]' : 'max-h-0',
                        'overflow-hidden',
                        'border-t',
                        'border-white/30',
                    ],
                    ['md:hidden'],
                    ['dark:border-slate-800'],
                )}
            >
                <div className={cn(['space-y-6', 'px-6', 'py-6'])}>
                    <ul
                        className={cn(
                            [
                                'space-y-4',
                                'text-base',
                                'font-semibold',
                                'text-slate-700',
                            ],
                            ['dark:text-slate-200'],
                        )}
                    >
                        {navList}
                    </ul>
                    <div
                        className={cn([
                            'flex',
                            'items-center',
                            'justify-between',
                        ])}
                    >
                        <div className={cn(['flex', 'items-center', 'gap-3'])}>
                            <SocialIconButton
                                href="https://github.com/"
                                ariaLabel="GitHub"
                                icon={
                                    <LuGithub className={socialIconClasses} />
                                }
                            />
                            <SocialIconButton
                                href="https://www.linkedin.com/"
                                ariaLabel="LinkedIn"
                                icon={
                                    <LuLinkedin className={socialIconClasses} />
                                }
                            />
                        </div>
                        <ThemeToggleButton />
                    </div>
                </div>
            </div>
        </header>
    );
};
const scrollToSection = (hash: string) => {
    const element = document.querySelector(hash);
    if (!element) return;
    const offset = window.innerWidth < 768 ? 100 : 140;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
        top: top < 0 ? 0 : top,
        behavior: 'smooth',
    });
};
