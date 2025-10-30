import { useOutsideClick } from '$lib/hooks/use-outside-click';
import { cn } from '$lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { type RefObject, useEffect, useId, useRef, useState } from 'react';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

export const ProjectCardList = () => {
    const [active, setActive] = useState<Project | boolean | null>(null);
    const id = useId();
    const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActive(false);
            }
        }

        if (active && typeof active === 'object') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === 'object' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn([
                            'fixed inset-0 z-10 h-full w-full bg-black/20',
                        ])}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === 'object' ? (
                    <div
                        className={cn([
                            'fixed inset-0 z-[100] grid place-items-center',
                        ])}
                    >
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.05,
                                },
                            }}
                            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`project-${active.title}-${active.id}`}
                            ref={ref}
                            className="flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-white sm:rounded-3xl md:h-fit md:max-h-[90%] dark:bg-neutral-900"
                        >
                            <motion.div
                                layoutId={`image-${active.title}-${active.id}`}
                            >
                                <img
                                    width={200}
                                    height={200}
                                    src={active.imageSrc}
                                    alt={active.title}
                                    className="h-80 w-full object-cover object-top sm:rounded-tl-lg sm:rounded-tr-lg lg:h-80"
                                />
                            </motion.div>

                            <div>
                                <div className="flex items-start justify-between p-4">
                                    <div className="">
                                        <motion.h3
                                            layoutId={`title-${active.title}-${active.id}`}
                                            className="font-medium text-base text-neutral-700 dark:text-neutral-200"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${active.id}`}
                                            className="text-base text-neutral-600 dark:text-neutral-400"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>

                                    <motion.a
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        href={active.imageSrc}
                                        target="_blank"
                                        className="rounded-full bg-green-500 px-4 py-3 font-bold text-sm text-white"
                                    >
                                        {active.description}
                                    </motion.a>
                                </div>
                                <div className="relative px-4 pt-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-neutral-600 text-xs [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400"
                                    >
                                        {typeof active.content === 'function'
                                            ? active.content()
                                            : active.content}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 items-start gap-4 md:grid-cols-2">
                {projects.map((project, _) => (
                    <ProjectCard
                        project={project}
                        setActive={setActive}
                        key={id}
                    />
                ))}
            </ul>
        </>
    );
};

export const CloseIcon = () => {
    return (
        <motion.svg
            role="img"
            aria-label="Close"
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <title>Close</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

const projects: Project[] = [
    {
        id: 1,
        description: 'Lana Del Rey',
        title: 'Summertime Sadness',
        imageSrc: 'https://assets.aceternity.com/demos/lana-del-rey.jpeg',
        content: () => {
            return (
                <p>
                    Lana Del Rey, an iconic American singer-songwriter, is
                    celebrated for her melancholic and cinematic music style.
                    Born Elizabeth Woolridge Grant in New York City, she has
                    captivated audiences worldwide with her haunting voice and
                    introspective lyrics. <br /> <br /> Her songs often explore
                    themes of tragic romance, glamour, and melancholia, drawing
                    inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed
                    albums, Lana Del Rey has established herself as a unique and
                    influential figure in the music industry, earning a
                    dedicated fan base and numerous accolades.
                </p>
            );
        },
    },
    {
        id: 2,
        description: 'Babbu Maan',
        title: 'Mitran Di Chhatri',
        imageSrc: 'https://assets.aceternity.com/demos/babbu-maan.jpeg',
        content: () => {
            return (
                <p>
                    Babu Maan, a legendary Punjabi singer, is renowned for his
                    soulful voice and profound lyrics that resonate deeply with
                    his audience. Born in the village of Khant Maanpur in
                    Punjab, India, he has become a cultural icon in the Punjabi
                    music industry. <br /> <br /> His songs often reflect the
                    struggles and triumphs of everyday life, capturing the
                    essence of Punjabi culture and traditions. With a career
                    spanning over two decades, Babu Maan has released numerous
                    hit albums and singles that have garnered him a massive fan
                    following both in India and abroad.
                </p>
            );
        },
    },

    {
        id: 3,
        description: 'Metallica',
        title: 'For Whom The Bell Tolls',
        imageSrc: 'https://assets.aceternity.com/demos/metallica.jpeg',
        content: () => {
            return (
                <p>
                    Metallica, an iconic American heavy metal band, is renowned
                    for their powerful sound and intense performances that
                    resonate deeply with their audience. Formed in Los Angeles,
                    California, they have become a cultural icon in the heavy
                    metal music industry. <br /> <br /> Their songs often
                    reflect themes of aggression, social issues, and personal
                    struggles, capturing the essence of the heavy metal genre.
                    With a career spanning over four decades, Metallica has
                    released numerous hit albums and singles that have garnered
                    them a massive fan following both in the United States and
                    abroad.
                </p>
            );
        },
    },
    {
        id: 5,
        description: 'Lord Himesh',
        title: 'Aap Ka Suroor',
        imageSrc: 'https://assets.aceternity.com/demos/aap-ka-suroor.jpeg',
        content: () => {
            return (
                <p>
                    Himesh Reshammiya, a renowned Indian music composer, singer,
                    and actor, is celebrated for his distinctive voice and
                    innovative compositions. Born in Mumbai, India, he has
                    become a prominent figure in the Bollywood music industry.{' '}
                    <br /> <br /> His songs often feature a blend of
                    contemporary and traditional Indian music, capturing the
                    essence of modern Bollywood soundtracks. With a career
                    spanning over two decades, Himesh Reshammiya has released
                    numerous hit albums and singles that have garnered him a
                    massive fan following both in India and abroad.
                </p>
            );
        },
    },
];
