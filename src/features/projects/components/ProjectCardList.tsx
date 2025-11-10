import { useOutsideClick } from '$lib/hooks/use-outside-click';
import { cn } from '$lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import {
    type FC,
    type MouseEvent,
    type RefObject,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import { LuExternalLink, LuGithub } from 'react-icons/lu';
import type { Project, ProjectContentBlock } from '../types';
import { ProjectCard } from './ProjectCard';

interface ProjectCardListProps {
    projects: Project[];
}

export const ProjectCardList: FC<ProjectCardListProps> = (props) => {
    const { projects } = props;

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

    const handleClose = (event?: MouseEvent<HTMLButtonElement>) => {
        console.log('実行');
        event?.stopPropagation();
        setActive(null);
    };

    const renderContentBlock = (block: ProjectContentBlock, index: number) => {
        switch (block.type) {
            case 'heading':
                return (
                    <h3
                        key={`heading-${index}`}
                        className="mb-4 font-bold text-xl md:text-2xl"
                    >
                        {block.text}
                    </h3>
                );
            case 'paragraph':
                return (
                    <p
                        key={`paragraph-${index}`}
                        className="mb-6 text-gray-600 dark:text-gray-300"
                    >
                        {block.text}
                    </p>
                );
            case 'list':
                return (
                    <ul
                        key={`list-${index}`}
                        className="mb-6 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300"
                    >
                        {block.items.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

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
                        className={cn('fixed inset-0 z-[100] overflow-y-auto')}
                    >
                        <div className="flex min-h-full items-center justify-center p-4 lg:p-6">
                            <motion.div
                                layoutId={`project-${active.title}-${active.id}`}
                                ref={ref}
                                className={cn(
                                    'relative flex w-full max-w-[960px] flex-col gap-6 overflow-hidden rounded-3xl bg-white p-4 shadow-xl sm:p-6 md:p-8 lg:p-10 dark:bg-neutral-900',
                                    'max-h-[90vh]',
                                )}
                            >
                                <div className="relative flex min-h-0 flex-1 flex-col gap-6 md:flex-row md:gap-10">
                                    <motion.button
                                        key={`button-${active.title}-${id}-desktop`}
                                        type="button"
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
                                        className={cn(
                                            'md:-right-2 lg:-right-2 lg:-top-3 pointer-events-auto absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-red-400 md:flex dark:hover:bg-red-500',
                                        )}
                                        onClick={handleClose}
                                        aria-label="Close project details"
                                    >
                                        <CloseIcon />
                                    </motion.button>
                                    <div className="flex min-h-0 flex-col gap-6 md:w-1/2">
                                        <motion.div
                                            layoutId={`image-${active.title}-${active.id}`}
                                            className="overflow-hidden rounded-2xl"
                                        >
                                            <img
                                                width={200}
                                                height={200}
                                                src={active.src}
                                                alt={active.title}
                                                className={cn(
                                                    'h-80 w-full object-cover object-top md:h-[420px]',
                                                )}
                                            />
                                        </motion.div>
                                        <div
                                            className={cn(
                                                'flex flex-col gap-4',
                                            )}
                                        >
                                            <motion.h3
                                                layoutId={`title-${active.title}-${active.id}`}
                                                className={cn(
                                                    'font-bold text-3xl md:text-4xl',
                                                )}
                                            >
                                                {active.title}
                                            </motion.h3>
                                            <motion.p
                                                layoutId={`description-${active.description}-${active.id}`}
                                                className={cn(
                                                    'mt-2 text-neutral-600 text-sm leading-relaxed md:text-base dark:text-neutral-300',
                                                )}
                                            >
                                                {active.description}
                                            </motion.p>
                                            {active.tags.length > 0 && (
                                                <motion.ul
                                                    layout
                                                    layoutId={`tags-${active.id}`}
                                                    className={cn(
                                                        'mt-3 flex flex-wrap gap-2',
                                                    )}
                                                >
                                                    {active.tags.map((tag) => (
                                                        <motion.li
                                                            layout
                                                            layoutId={`tag-${active.id}-${tag}`}
                                                            key={tag}
                                                            className={cn(
                                                                'rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-600 text-xs dark:bg-neutral-800 dark:text-neutral-300',
                                                            )}
                                                        >
                                                            {tag}
                                                        </motion.li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                            {active.link &&
                                                (active.link.demo ||
                                                    active.link.github) && (
                                                    <motion.div
                                                        layout
                                                        className={cn(
                                                            'flex flex-wrap gap-3',
                                                        )}
                                                    >
                                                        {active.link.demo && (
                                                            <motion.a
                                                                layout
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                }}
                                                                href={
                                                                    active.link
                                                                        .demo
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className={cn(
                                                                    'inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-medium text-neutral-700 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800',
                                                                )}
                                                            >
                                                                <LuExternalLink className="h-4 w-4" />
                                                                <span>
                                                                    Live Demo
                                                                </span>
                                                            </motion.a>
                                                        )}
                                                        {active.link.github && (
                                                            <motion.a
                                                                layout
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                }}
                                                                href={
                                                                    active.link
                                                                        .github
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-medium text-neutral-700 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                            >
                                                                <LuGithub className="h-4 w-4" />
                                                                <span>
                                                                    GitHub
                                                                </span>
                                                            </motion.a>
                                                        )}
                                                    </motion.div>
                                                )}
                                        </div>
                                    </div>
                                    <div className="relative min-h-0 flex-1 overflow-y-scroll md:overflow-hidden md:pl-4 lg:pl-8">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex h-full min-h-0 flex-col items-start gap-4 overflow-y-auto pr-1 pb-10 text-neutral-600 text-xs [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] md:text-sm lg:text-base dark:text-neutral-400"
                                        >
                                            {active.content.map(
                                                renderContentBlock,
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="grid w-full auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
                {projects.map((project) => (
                    <li key={project.id} className="flex h-full w-full">
                        <ProjectCard project={project} setActive={setActive} />
                    </li>
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
