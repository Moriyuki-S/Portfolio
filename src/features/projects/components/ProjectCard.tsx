import { motion } from 'motion/react';
import type { Dispatch, SetStateAction } from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
    project: Project;
    setActive: Dispatch<SetStateAction<boolean | Project | null>>;
}

export const ProjectCard = (props: ProjectCardProps) => {
    const { project, setActive } = props;

    return (
        <motion.div
            layoutId={`project-${project.title}-${project.id}`}
            key={project.title}
            onClick={() => setActive(project)}
            className="flex cursor-pointer flex-col rounded-xl p-4 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
            <div className="flex w-full flex-col gap-4">
                <motion.div layoutId={`image-${project.title}-${project.id}`}>
                    <img
                        width={100}
                        height={100}
                        src={project.src}
                        alt={project.title}
                        className="h-60 w-full rounded-lg object-cover object-top"
                    />
                </motion.div>
                <motion.div
                    layout
                    className="flex flex-col items-center justify-center text-center md:items-start md:text-left"
                >
                    <motion.h3
                        layoutId={`title-${project.title}-${project.id}`}
                        className="font-semibold text-lg text-neutral-800 dark:text-neutral-200"
                    >
                        {project.title}
                    </motion.h3>
                    <motion.p
                        layoutId={`description-${project.description}-${project.id}`}
                        className="mt-2 text-neutral-600 text-sm leading-relaxed dark:text-neutral-400"
                    >
                        {project.description}
                    </motion.p>
                    {project.tags.length > 0 && (
                        <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                            {project.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-600 text-xs dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};
