import { cn } from '$lib/utils';
import type { FC, ReactElement } from 'react';

type SocialIconButtonProps = {
    href: string;
    ariaLabel: string;
    icon: ReactElement;
    className?: string;
};

export const SocialIconButton: FC<SocialIconButtonProps> = ({
    href,
    ariaLabel,
    icon,
    className,
}) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={ariaLabel}
        className={cn('social-button', className)}
    >
        {icon}
    </a>
);
