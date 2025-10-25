import { Vortex } from '$lib/components/vortex';
import { cn } from '$lib/utils';
import type { FC } from 'react';
import { LuArrowDown } from 'react-icons/lu';

export const HerolLayout: FC = () => {
    return (
        <div
            className={cn(
                ['md:w-full', 'h-screen', 'overflow-hidden'],

                ['md:overflow-hidden'],
            )}
        >
            <Vortex
                backgroundColor="black"
                baseHue={120}
                rangeY={200}
                className={cn([
                    'flex h-full w-full flex-col items-center justify-center px-2 py-4 md:px-10',
                ])}
            >
                <h1
                    className={cn(
                        [
                            'text-white',
                            'text-6xl',
                            'font-bold',
                            'text-shadow-lg/30',
                            'px-5',
                            '-translate-y-8',
                        ],
                        ['md:text-16xl'],
                    )}
                >
                    My Portfolio Site
                </h1>
                <div
                    className={cn(['absolute', 'bottom-20'], ['md:bottom-28'])}
                >
                    <a
                        href="#profile"
                        className={cn([
                            'flex',
                            'items-center',
                            'cursor-pointer',
                            'font-extrabold',
                            'text-white',
                        ])}
                    >
                        <LuArrowDown
                            size={24}
                            className={cn([
                                'me-2',
                                'font-bold',
                                'mt-1',
                                'motion-safe:animate-bounce',
                            ])}
                        />
                        <p>スクロール</p>
                    </a>
                </div>
            </Vortex>
        </div>
    );
};