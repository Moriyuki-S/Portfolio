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
            className="flex cursor-pointer flex-col rounded-xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
            <div className="flex w-full flex-col gap-4">
                <motion.div layoutId={`image-${project.title}-${project.id}`}>
                    <img
                        width={100}
                        height={100}
                        src={project.imageSrc}
                        alt={project.title}
                        className="h-60 w-full rounded-lg object-cover object-top"
                    />
                </motion.div>
                <div className="flex flex-col items-center justify-center">
                    <motion.h3
                        layoutId={`title-${project.title}-${project.id}`}
                        className="text-center font-medium text-base text-neutral-800 md:text-left dark:text-neutral-200"
                    >
                        {project.title}
                    </motion.h3>
                    <motion.p
                        layoutId={`description-${project.description}-${project.id}`}
                        className="text-center text-base text-neutral-600 md:text-left dark:text-neutral-400"
                    >
                        {project.description}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};
