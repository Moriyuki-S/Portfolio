import type { JSX } from 'react';

export type Project = {
    id: number;
    title: string;
    imageSrc: string;
    description: string;
    content: () => JSX.Element;
    link?: {
        demo: string;
        github: string;
    }
};
