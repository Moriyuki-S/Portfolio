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

    const [active, setActive] = useState<Project | null>(null);
    const id = useId();
    const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActive(null);
            }
        }

        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    const handleClose = (event?: MouseEvent<HTMLButtonElement>) => {
        event?.stopPropagation();
        setActive(null);
    };

    const renderContentBlock = (block: ProjectContentBlock, index: number) => {
        switch (block.type) {
            case 'heading':
                return (
                    <h3
                        key={`heading-${index}`}
                        className={cn(['mb-4 font-bold text-xl md:text-2xl'])}
                    >
                        {block.text}
                    </h3>
                );
            case 'paragraph':
                return (
                    <p
                        key={`paragraph-${index}`}
                        className={cn([
                            'mb-6 text-gray-600 dark:text-gray-300',
                        ])}
                    >
                        {block.text}
                    </p>
                );
            case 'list':
                return (
                    <ul
                        key={`list-${index}`}
                        className={cn([
                            'mb-6 list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300',
                        ])}
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
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn([
                            'fixed inset-0 z-10 h-full w-full bg-black/20 backdrop-blur-sm',
                        ])}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active ? (
                    <div
                        className={cn([
                            'fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4 sm:p-6',
                        ])}
                    >
                        <motion.div
                            layoutId={`project-${active.title}-${active.id}`}
                            ref={ref}
                            className={cn([
                                'relative flex w-full max-w-[960px] flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-neutral-900',
                                'h-[85vh] md:h-auto md:max-h-[90vh]',
                            ])}
                        >
                            <div
                                className={cn([
                                    'pointer-events-none sticky top-0 right-0 z-50 flex justify-end p-4 pb-0',
                                ])}
                            >
                                <motion.button
                                    key={`button-${active.title}-${id}-desktop`}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{
                                        opacity: 0,
                                        transition: { duration: 0.05 },
                                    }}
                                    className={cn([
                                        'pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-red-100',
                                        'dark:bg-neutral-800/90 dark:hover:bg-red-900/30',
                                    ])}
                                    onClick={handleClose}
                                    aria-label="Close project details"
                                >
                                    <CloseIcon />
                                </motion.button>
                            </div>

                            <div
                                className={cn([
                                    '-mt-10 md:-mt-14 flex flex-col md:flex-row',
                                ])}
                            >
                                {' '}
                                {/* ボタン分のネガティブマージンでレイアウト調整 */}
                                {/* Left Column: Image ONLY (Sticky on Desktop) */}
                                <div
                                    className={cn([
                                        'w-full p-6 md:w-1/2 md:p-10',
                                    ])}
                                >
                                    <div
                                        className={cn([
                                            'flex flex-col gap-6 md:sticky md:top-10',
                                        ])}
                                    >
                                        {' '}
                                        {/* ここで画像を固定 */}
                                        <motion.div
                                            layoutId={`image-${active.title}-${active.id}`}
                                            className={cn([
                                                'relative overflow-hidden rounded-2xl',
                                            ])}
                                        >
                                            <img
                                                width={200}
                                                height={200}
                                                src={active.src}
                                                alt={active.title}
                                                className={cn([
                                                    'block aspect-[440/420] w-full object-cover object-left',
                                                ])}
                                            />
                                        </motion.div>
                                        {/* Title / Description / Tags / Links (Desktop shows under image, mobile also stacked first) */}
                                        <div
                                            className={cn([
                                                'flex flex-col gap-4',
                                            ])}
                                        >
                                            <motion.h3
                                                layoutId={`title-${active.title}-${active.id}`}
                                                className={cn([
                                                    'font-bold text-2xl md:text-4xl',
                                                ])}
                                            >
                                                {active.title}
                                            </motion.h3>
                                            <motion.p
                                                layoutId={`description-${active.description}-${active.id}`}
                                                className={cn([
                                                    'text-neutral-600 text-sm leading-relaxed md:text-base dark:text-neutral-300',
                                                ])}
                                            >
                                                {active.description}
                                            </motion.p>

                                            {/* Tags */}
                                            {active.tags.length > 0 && (
                                                <motion.ul
                                                    layout
                                                    layoutId={`tags-${active.id}`}
                                                    className={cn([
                                                        'flex flex-wrap gap-2',
                                                    ])}
                                                >
                                                    {active.tags.map((tag) => (
                                                        <motion.li
                                                            layout
                                                            layoutId={`tag-${active.id}-${tag}`}
                                                            key={tag}
                                                            className={cn([
                                                                'rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-600 text-xs dark:bg-neutral-800 dark:text-neutral-300',
                                                            ])}
                                                        >
                                                            {tag}
                                                        </motion.li>
                                                    ))}
                                                </motion.ul>
                                            )}

                                            {/* Links */}
                                            {active.link &&
                                                (active.link.demo ||
                                                    active.link.github) && (
                                                    <motion.div
                                                        layout
                                                        className={cn([
                                                            'flex flex-wrap gap-3 pt-2',
                                                        ])}
                                                    >
                                                        {active.link.demo && (
                                                            <a
                                                                href={
                                                                    active.link
                                                                        .demo
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className={cn([
                                                                    'inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-medium text-neutral-700 text-sm hover:bg-neutral-100',
                                                                    'dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800',
                                                                ])}
                                                            >
                                                                <LuExternalLink
                                                                    className={cn(
                                                                        [
                                                                            'h-4 w-4',
                                                                        ],
                                                                    )}
                                                                />
                                                                <span>
                                                                    Live Demo
                                                                </span>
                                                            </a>
                                                        )}
                                                        {active.link.github && (
                                                            <a
                                                                href={
                                                                    active.link
                                                                        .github
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className={cn([
                                                                    'inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-medium text-neutral-700 text-sm hover:bg-neutral-100',
                                                                    'dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800',
                                                                ])}
                                                            >
                                                                <LuGithub
                                                                    className={cn(
                                                                        [
                                                                            'h-4 w-4',
                                                                        ],
                                                                    )}
                                                                />
                                                                <span>
                                                                    GitHub
                                                                </span>
                                                            </a>
                                                        )}
                                                    </motion.div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                {/* Right Column: Title, Tags, Links, AND Content (Scrollable) */}
                                <div
                                    className={cn([
                                        'flex flex-1 flex-col p-6 pt-0 md:p-10 md:pl-0',
                                    ])}
                                >
                                    {/* Main Content Body */}
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={cn([
                                            'text-neutral-600 text-sm md:text-base dark:text-neutral-400',
                                        ])}
                                    >
                                        {active.content.map(renderContentBlock)}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>

            <ul
                className={cn([
                    'grid w-full auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10',
                ])}
            >
                {projects.map((project) => (
                    <li key={project.id} className={cn(['flex h-full w-full'])}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(['h-4 w-4 text-neutral-500 dark:text-neutral-400'])}
        >
            <title>Close</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};
