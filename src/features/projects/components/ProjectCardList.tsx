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
                        <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
                            <motion.div
                                layoutId={`project-${active.title}-${active.id}`}
                                ref={ref}
                                className={cn(
                                    'relative flex w-full max-w-[960px] flex-col rounded-3xl bg-white shadow-xl dark:bg-neutral-900',
                                    // スマホではカード全体をスクロール可能に (overflow-y-auto)
                                    // PCではカードを固定し、内部でスクロール (overflow-hidden)
                                    'max-h-[85vh] overflow-y-auto md:max-h-[85vh] md:overflow-hidden md:p-8 lg:p-10',
                                )}
                            >
                                {/* 修正点: バツボタンの配置
                                    スマホ: sticky top-0 でスクロールに追従させる
                                    PC: absolute で右上に固定
                                */}
                                <div className="pointer-events-none sticky top-0 z-50 flex w-full justify-end p-4 md:absolute md:top-0 md:right-0 md:p-0">
                                    <motion.button
                                        key={`button-${active.title}-${id}-desktop`}
                                        type="button"
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{
                                            opacity: 0,
                                            transition: { duration: 0.05 },
                                        }}
                                        className={cn(
                                            'pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-red-400 dark:hover:bg-red-500',
                                            // PC用の位置調整
                                            'md:absolute md:top-6 md:right-6 lg:top-8 lg:right-8',
                                        )}
                                        onClick={handleClose}
                                        aria-label="Close project details"
                                    >
                                        <CloseIcon />
                                    </motion.button>
                                </div>

                                <div className="relative flex flex-col gap-6 md:h-full md:flex-row md:gap-10">
                                    {/* 左カラム: 画像など */}
                                    <div className="flex flex-col gap-5 [-ms-overflow-style:none] [scrollbar-width:none] md:w-1/2 md:overflow-y-auto md:pr-2">
                                        <motion.div
                                            layoutId={`image-${active.title}-${active.id}`}
                                            className={cn(
                                                'relative w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800',
                                                'aspect-[440/420] sm:aspect-[16/10] md:aspect-[16/9]',
                                                // 修正点: スマホ時にstickyヘッダーの分だけ画像を上に引き上げ、ボタンの下に潜り込ませる
                                                '-mt-16 p-4 md:mt-0 md:p-0',
                                            )}
                                        >
                                            <img
                                                src={active.src}
                                                alt={active.title}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        </motion.div>

                                        {/* 画像の下のテキスト情報（PCの場合は左カラムに配置） */}
                                        <div className="flex flex-col gap-4 px-4 pb-4 md:px-0 md:pb-0">
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

                                    {/* 右カラム: コンテンツ (PCではスクロール) */}
                                    <div className="relative flex-1 px-4 pb-10 md:min-h-0 md:overflow-hidden md:px-0 md:pb-0 md:pl-4 lg:pl-8">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-start gap-4 text-neutral-600 text-xs md:h-full md:overflow-y-auto md:pr-1 md:text-sm lg:text-base dark:text-neutral-400"
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
