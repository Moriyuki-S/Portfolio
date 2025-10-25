import { cn } from '$lib/utils';
import { Avatar } from '@heroui/react';
import type { FC } from 'react';
import { SectionContainer } from '../layout/sectionContainer';
import { TimelineList } from '../ui/timeline';

export const ProfileSection: FC = () => {
    return (
        <SectionContainer sectionID="profile">
            <hgroup className={cn(['md:mb-20'])}>
                <h2
                    className={cn(
                        [
                            'text-5xl',
                            'mb-6',
                            'font-bold',
                            'text-gradient',
                            'bg-center',
                        ],
                        ['md:text-7xl', 'md:mb-12'],
                    )}
                >
                    About Me
                </h2>
                <div
                    className={cn(
                        ['flex', 'flex-col', 'items-center', 'gap-y-4'],
                        ['md:flex-row', 'md:gap-x-8'],
                    )}
                >
                    <div className={cn(['w-fit'])}>
                        <Avatar
                            className={cn([
                                'w-20',
                                'h-20',
                                'box-border',
                                'rounded-full',
                            ])}
                        />
                    </div>
                    <p className={cn(['leading-relaxed'])}>
                        私はフロントエンドエンジニアで、
                        ReactやNext.jsを使った開発が得意です。
                        特に、ユーザーエクスペリエンスを重視したインターフェースの設計と実装に情熱を持っています。
                        現在は、最新のウェブ技術を活用して、より良いウェブ体験を提供することに取り組んでいます。
                    </p>
                </div>
            </hgroup>
            <section
                aria-labelledby="work-experience"
                className={cn(
                    ['mt-10', 'max-w-3xl', 'mx-auto', 'mb-18'],
                    ['md:mb-32'],
                )}
            >
                <h3
                    className={cn(
                        ['text-3xl', 'font-bold', 'mt-10', 'mb-4'],
                        ['md:text-5xl'],
                    )}
                >
                    Work Experience
                </h3>
                <p className={cn(['mb-12'])}>
                    これまでのプログラミング関連のアルバイトの経験です。
                </p>
                <TimelineList
                    timelines={[
                        {
                            id: 1,
                            title: 'バックエンド',
                            description: 'バックエンドの実装など',
                            date: {
                                start: new Date('2024-04'),
                            },
                            type: 'work',
                            location: {
                                text: 'Mui Lab Inc',
                                url: 'https://example.com',
                            },
                        },
                        {
                            id: 2,
                            title: 'Back-end Developer at ABC Inc',
                            description:
                                'Worked on building RESTful APIs using Node.js and Express.',
                            date: {
                                start: new Date('2021-01-01'),
                                end: new Date('2022-01-01'),
                            },
                            type: 'work',
                            location: {
                                text: 'Star Up',
                                url: 'https://example.com',
                            },
                        },
                    ]}
                />
            </section>
            <section
                aria-labelledby="education"
                className={cn(['mt-10', 'max-w-3xl', 'mx-auto', 'mb-18'])}
            >
                <h3
                    className={cn(
                        ['text-3xl', 'font-bold', 'mt-10', 'mb-4'],
                        ['md:text-5xl'],
                    )}
                >
                    Education
                </h3>
                <TimelineList
                    timelines={[
                        {
                            id: 1,
                            title: '京都大学工学部物理工学科',
                            description:
                                'Studied computer science with a focus on software development.',
                            date: {
                                start: new Date('2018-04-01'),
                                end: new Date('2022-03-31'),
                            },
                            type: 'education',
                            location: {
                                text: '京都大学',
                                url: 'https://www.kyoto-u.ac.jp/',
                            },
                        },
                        {
                            id: 2,
                            title: 'Web Development Bootcamp',
                            description:
                                'Completed an intensive bootcamp focused on full-stack web development.',
                            date: {
                                start: new Date('2020-01-01'),
                                end: new Date('2020-12-31'),
                            },
                            type: 'education',
                        },
                    ]}
                />
            </section>
        </SectionContainer>
    );
};
