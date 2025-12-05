import { cn } from '$lib/utils';
import { navigate } from 'astro:transitions/client';
import {
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
} from '@heroui/react';
import {
    LucideCircleUser,
    LucideCode,
    LucideHome,
    LucideSend,
} from 'lucide-react';
import { type FC, type MouseEvent, useState } from 'react';
import { LuGithub, LuLinkedin } from 'react-icons/lu';
import { ThemeToggleButton } from '../ui/ThemeToggleButton';

const socialButtonClasses = cn('social-button');
const socialIconClasses = 'relative z-10 h-5 w-5';

export const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const navigateWithAnimation = (e: MouseEvent, href: string) => {
        e.preventDefault();
        const currentPath = window.location.pathname;
        if (currentPath === href) {
            return;
        }
        navigate(href);
    };

    return (
        <>
            <Navbar
                shouldHideOnScroll
                isBlurred
                className={cn([
                    ['px-5'],
                    ['hidden'],
                    [
                        'md:flex',
                        'md:px-6',
                        'lg:px-10',
                        'md:top-0',
                        'md:z-50',
                        'md:bg-white',
                        'dark:md:bg-transparent',
                    ],
                ])}
                classNames={{
                    item: [
                        'flex',
                        'relative',
                        'h-full',
                        'items-center',
                        "data-[active=true]:after:content-['']",
                        'data-[active=true]:after:absolute',
                        'data-[active=true]:after:bottom-0',
                        'data-[active=true]:after:left-0',
                        'data-[active=true]:after:right-0',
                        'data-[active=true]:after:h-[2px]',
                        'data-[active=true]:after:rounded-[2px]',
                        'data-[active=true]:after:bg-primary',
                    ],
                }}
                isBordered
                maxWidth="full"
                position="sticky"
                onMenuOpenChange={setIsMenuOpen}
            >
                <NavbarContent justify="start">
                    <NavbarBrand>
                        <span
                            className={cn(
                                [
                                    'font-bold',
                                    'text-3xl',
                                    'text-gradient',
                                    'animate-text-gradient',
                                ],
                                ['sm:text-4xl'],
                                ['md:text-4xl'],
                                ['lg:text-5xl'],
                            )}
                        >
                            Portfolio
                        </span>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent
                    className={cn(
                        [
                            'hidden',
                            'text-black',
                            'md:flex',
                            'md:flex-wrap',
                            'md:gap-x-4',
                            'md:gap-y-1',
                        ],
                        ['lg:flex-nowrap', 'lg:gap-x-8'],
                        ['xl:gap-x-10'],
                        ['dark:text-white'],
                        [
                            '[&>li]:px-3',
                            '[&>li]:py-2',
                            'lg:[&>li]:py-3',
                            'lg:[&>li]:px-4',
                            'dark:[&>li]:text-white',
                        ],
                    )}
                    justify="center"
                >
                    <NavbarItem isActive>
                        <Link
                            className="flex items-center "
                            onClick={(e) => navigateWithAnimation(e, '/')}
                        >
                            <LucideHome className="me-2" />
                            ホーム
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="flex items-center" href="/#profile">
                            <LucideCircleUser className="me-2" />
                            プロフィール
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="flex items-center" href="/#project">
                            <LucideCode className="me-2" />
                            プロジェクト
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            onClick={(e) =>
                                navigateWithAnimation(e, '/contact')
                            }
                            className="flex cursor-pointer items-center"
                        >
                            <LucideSend className="me-2" />
                            お問い合わせ
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent
                    className={cn([
                        'hidden',
                        'items-center',
                        'gap-6',
                        'md:flex',
                    ])}
                    justify="end"
                >
                    <NavbarItem>
                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="GitHub"
                            className={socialButtonClasses}
                        >
                            <LuGithub className={socialIconClasses} />
                        </a>
                    </NavbarItem>
                    <NavbarItem>
                        <a
                            href="https://www.linkedin.com/"
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="LinkedIn"
                            className={socialButtonClasses}
                        >
                            <LuLinkedin className={socialIconClasses} />
                        </a>
                    </NavbarItem>
                    <NavbarItem>
                        <ThemeToggleButton />
                    </NavbarItem>
                </NavbarContent>
                <NavbarMenuToggle
                    aria-label={
                        isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'
                    }
                    className={cn(['sm:hidden'])}
                />
            </Navbar>
        </>
    );
};
