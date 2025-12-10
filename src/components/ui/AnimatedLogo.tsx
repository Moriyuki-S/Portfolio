import { cn } from '$lib/utils';
import type { ClassValue } from 'clsx';
import type { FC } from 'react';

type AnimatedLogoProps = {
    label?: string;
    className?: ClassValue;
};

export const AnimatedLogo: FC<AnimatedLogoProps> = ({
    label = 'Portfolio',
    className,
}) => {
    return (
        <span
            className={cn(
                [
                    'group',
                    'relative',
                    'inline-flex',
                    'items-center',
                    'justify-center',
                    'overflow-hidden',
                    'rounded-full',
                    'px-6',
                    'py-3',
                    'text-[0.65rem]',
                    'font-semibold',
                    'uppercase',
                    'tracking-[0.32em]',
                    'text-white',
                    'shadow-[0_18px_45px_rgba(79,70,229,0.35)]',
                    'transition-transform',
                    'duration-300',
                    'hover:scale-[1.03]',
                ],
                ['sm:text-sm'],
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cn([
                    'absolute',
                    '-inset-[30%]',
                    'rounded-full',
                    'bg-gradient-to-r',
                    'from-indigo-500',
                    'via-sky-500',
                    'to-purple-500',
                    'opacity-60',
                    'blur-3xl',
                ])}
            />
            <span
                aria-hidden="true"
                className={cn([
                    'absolute',
                    'inset-0',
                    'rounded-full',
                    'bg-gradient-to-r',
                    'from-indigo-500',
                    'via-sky-500',
                    'to-purple-500',
                    'opacity-90',
                ])}
            />
            <span
                aria-hidden="true"
                className={cn([
                    'absolute',
                    '-inset-3',
                    'rounded-full',
                    'bg-[conic-gradient(from_120deg_at_50%_50%,rgba(165,243,252,0.6),transparent_70%)]',
                    'opacity-60',
                    'mix-blend-screen',
                    'animate-[spin_12s_linear_infinite]',
                ])}
            />
            <span
                aria-hidden="true"
                className={cn([
                    'absolute',
                    'inset-0',
                    'rounded-full',
                    'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_58%)]',
                    'opacity-80',
                ])}
            />
            <span
                className={cn([
                    'relative',
                    'z-10',
                    'tracking-[0.35em]',
                    'text-white',
                    'drop-shadow-[0_6px_30px_rgba(15,23,42,0.45)]',
                    'md:tracking-[0.4em]',
                ])}
            >
                {label}
            </span>
        </span>
    );
};
