import type { Multilingual } from '$lib/i18n/type';
import { cn } from '$lib/utils';
import { Link } from '@heroui/react';
import type { FC } from 'react';
import { IoOpenOutline } from 'react-icons/io5';
import {
    LuBuilding,
    LuBuilding2,
    LuClock,
    LuLink,
    LuUniversity,
} from 'react-icons/lu';
import type { TimelineType } from 'src/types/timeline';

type TimelineProps = {
    timeline: TimelineType;
    translate: (value: Multilingual) => string;
};

const formatDate = (date: Date) =>
    date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

export const Timeline: FC<TimelineProps> = (props) => {
    const { timeline, translate } = props;
    const titleText = translate(timeline.title);
    const descriptionText = translate(timeline.description);
    const locationText = timeline.location
        ? translate(timeline.location.text)
        : null;

    const getTimelineIcon = (
        type: TimelineType['type'],
        iconClass?: string,
    ) => {
        const baseIconClass = [
            'w-12',
            'h-12',
            'flex',
            'justify-center',
            'items-center',
            'bg-blue-400',
            'text-white',
            'p-3',
            'rounded-full',
        ];

        switch (type) {
            case 'work':
                return (
                    <div
                        className={cn(
                            baseIconClass,
                            ['bg-blue-400'],
                            iconClass,
                        )}
                    >
                        <LuBuilding2 className={cn([iconClass])} />
                    </div>
                );

            case 'education':
                return (
                    <div
                        className={cn(
                            baseIconClass,
                            ['bg-yellow-400'],
                            iconClass,
                        )}
                    >
                        <LuUniversity className={cn([iconClass])} />
                    </div>
                );

            default:
                return (
                    <div
                        className={cn(
                            baseIconClass,
                            ['bg-yellow-400'],
                            iconClass,
                        )}
                    >
                        <LuBuilding className={cn([iconClass])} />
                    </div>
                );
        }
    };

    return (
        <div
            className={cn(
                ['flex', 'gap-x-2', 'justify-center'],
                ['md:gap-x-8'],
            )}
        >
            <div
                className={cn(['flex', 'flex-col', 'items-center', 'gap-y-2'])}
            >
                {getTimelineIcon(timeline.type, 'text-2xl')}
                <div
                    className={cn(
                        [
                            'w-0.5',
                            'h-full',
                            'translate-y-1/10',
                            'scale-y-120',
                            'bg-gray-300',
                        ],
                        ['sm:scale-y-150', 'sm:translate-y-1/4'],
                    )}
                />
            </div>

            <div
                className={cn(
                    [
                        'rounded-lg',
                        'h-fit',
                        'border',
                        'grow',
                        'p-4',
                        'translate-y-4',
                        'shadow-md',
                    ],
                    ['md:max-w-[700px]', 'md:p-6'],
                    ['dark:border-gray-700'],
                )}
            >
                <div className={cn(['w-full', 'h-auto'])}>
                    <h4
                        className={cn(
                            ['text-xl', 'font-bold', 'mb-4'],
                            ['md:text-2xl'],
                        )}
                    >
                        {titleText}
                    </h4>
                    <div
                        className={cn(
                            [['flex', 'flex-col', 'gap-2', 'mb-4']],
                            ['sm:flex-row', 'sm:gap-4'],
                        )}
                    >
                        <div className={cn(['flex', 'items-center'])}>
                            <LuClock className={cn(['me-2'])} />
                            <span className={cn(['text-sm'])}>
                                {formatDate(timeline.date.start)}
                            </span>
                            ~
                            {timeline.date.end && (
                                <span className={cn(['text-sm'])}>
                                    {formatDate(timeline.date.end)}
                                </span>
                            )}
                        </div>
                        {timeline.location && (
                            <div className={cn(['flex', 'items-center'])}>
                                {timeline.type === 'work' ? (
                                    <LuBuilding2
                                        className={cn([
                                            'me-2',
                                            'text-gray-400',
                                        ])}
                                    />
                                ) : timeline.type === 'education' ? (
                                    <LuUniversity
                                        className={cn([
                                            'me-2',
                                            'text-gray-400',
                                        ])}
                                    />
                                ) : (
                                    <LuLink
                                        className={cn([
                                            'me-2',
                                            'text-gray-400',
                                        ])}
                                    />
                                )}
                                <Link
                                    href={timeline.location.url}
                                    className={cn([
                                        'text-blue-600',
                                        'hover:underline',
                                    ])}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {locationText}
                                    <IoOpenOutline className="ms-2" />
                                </Link>
                            </div>
                        )}
                    </div>
                    <p>{descriptionText}</p>
                </div>
            </div>
        </div>
    );
};
