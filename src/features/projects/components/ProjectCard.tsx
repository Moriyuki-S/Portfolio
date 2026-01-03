import { cn } from '$lib/utils';
import { motion } from 'motion/react';
import type { Dispatch, FC, SetStateAction } from 'react';
import type { Multilingual } from '$lib/i18n/type';
import type { Project } from '../types';

type Translate = (value: Multilingual) => string;

interface ProjectCardProps {
    project: Project;
    translate: Translate;
    setActive: Dispatch<SetStateAction<Project | null>>;
}

export const ProjectCard: FC<ProjectCardProps> = (props) => {
    const { project, translate, setActive } = props;
    const titleText = translate(project.title);
    const descriptionText = translate(project.description);
    const tagTexts = project.tags.map(translate);

    return (
        <motion.div
            layoutId={`project-${project.id}`}
            key={project.id}
            onClick={() => setActive(project)}
            className={cn([
                'flex h-full w-full cursor-pointer flex-col rounded-2xl border bg-white/60 p-4 transition-colors duration-200 hover:bg-neutral-50 md:p-6',
                'dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:bg-neutral-800',
            ])}
            whileHover={{
                y: -6,
                scale: 1.01,
                boxShadow: '0 18px 40px -15px rgba(15, 23, 42, 0.25)',
            }}
            whileTap={{ scale: 0.99 }}
            transition={{
                type: 'spring',
                stiffness: 220,
                damping: 18,
                mass: 0.8,
            }}
        >
            <div className={cn(['flex w-full flex-1 flex-col gap-4'])}>
                <motion.div layoutId={`image-${project.id}`}>
                    <img
                        width={100}
                        height={100}
                        src={project.src}
                        alt={titleText}
                        className={cn([
                            'aspect-[440/420] w-full rounded-xl object-cover object-left',
                        ])}
                    />
                </motion.div>
                <motion.div
                    layout
                    className={cn([
                        'flex flex-1 flex-col items-center justify-center text-center md:items-start md:text-left',
                    ])}
                >
                    <motion.h3
                        layoutId={`title-${project.id}`}
                        className={cn(['font-semibold text-xl md:text-2xl'])}
                    >
                        {titleText}
                    </motion.h3>
                    <motion.p
                        layoutId={`description-${project.id}`}
                        className={cn([
                            'mt-2 text-neutral-600 text-sm leading-relaxed md:text-base dark:text-neutral-400',
                        ])}
                    >
                        {descriptionText}
                    </motion.p>
                    {tagTexts.length > 0 && (
                        <motion.ul
                            layoutId={`tags-${project.id}`}
                            className={cn([
                                'mt-4 flex flex-wrap justify-center gap-2 md:justify-start',
                            ])}
                        >
                            {tagTexts.map((tag) => (
                                <motion.li
                                    layoutId={`tag-${project.id}-${tag}`}
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
                </motion.div>
            </div>
        </motion.div>
    );
};
