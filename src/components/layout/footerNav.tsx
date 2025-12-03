import { cn } from '$lib/utils';
import { navigate } from 'astro:transitions/client';
import {
    Button,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import {
    LucideCircleUser,
    LucideCode,
    LucideHome,
    LucideSend,
} from 'lucide-react';
import { type FC, type MouseEvent, useState } from 'react';
import { LuMenu } from 'react-icons/lu';
import { ThemeToggleButton } from '../ui/ThemeToggleButton';

export const FooterNav: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

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
                    <div>
                        <span
                            className={cn(
                                [
                                    'font-bold',
                                    'text-2xl',
                                    'text-gradient',
                                    'animate-text-gradient',
                                ],
                                ['sm:text-3xl'],
                                ['md:text-4xl'],
                            )}
                        >
                            Portfolio
                        </span>
                    </div>
                    <div className={cn(['flex', 'items-center', 'gap-x-8'])}>
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
                    <ModalHeader>目次</ModalHeader>
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
                                ['[&>li]:w-40'],
                            )}
                        >
                            <li>
                                <Link href="#" onClick={handleMenuToggle}>
                                    <LucideHome className="me-3" />
                                    ホーム
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#profile"
                                    onClick={handleMenuToggle}
                                >
                                    <LucideCircleUser className="me-3" />
                                    プロフィール
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#project"
                                    onClick={handleMenuToggle}
                                >
                                    <LucideCode className="me-3" />
                                    プロジェクト
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    onClick={(e) =>
                                        navigateWithAnimation(e, '/contact')
                                    }
                                >
                                    <LucideSend className="me-3" />
                                    お問い合わせ
                                </Link>
                            </li>
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onPress={handleMenuToggle}>
                            閉じる
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
