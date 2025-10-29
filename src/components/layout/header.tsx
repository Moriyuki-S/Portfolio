import { cn } from '$lib/utils';
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
import { type FC, useState } from 'react';
import { ThemeToggleButton } from '../ui/ThemeToggleButton';

export const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <>
            <Navbar
                shouldHideOnScroll
                className={cn([
                    ['px-5'],
                    ['hidden'],
                    [
                        'md:flex',
                        'md:px-6',
                        'lg:px-10',
                        'md:top-0',
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
                onMenuOpenChange={setIsMenuOpen}
            >
                <NavbarContent justify="start">
                    <NavbarBrand>
                        <span
                            className={cn(
                                [
                                    'font-bold',
                                    'text-2xl',
                                    'text-gradient',
                                    'animate-text-gradient',
                                ],
                                ['sm:text-3xl'],
                                ['md:text-3xl'],
                                ['lg:text-4xl'],
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
                        <Link className="flex items-center " href="#">
                            <LucideHome className="me-2" />
                            ホーム
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="flex items-center" href="#profile">
                            <LucideCircleUser className="me-2" />
                            プロフィール
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="flex items-center" href="#works">
                            <LucideCode className="me-2" />
                            プロジェクト
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="flex items-center" href="#contact">
                            <LucideSend className="me-2" />
                            お問い合わせ
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent
                    className={cn(['hidden', 'md:flex'])}
                    justify="end"
                >
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
