import type { JSX } from 'react';

export type Project = {
    id: number;
    title: string;
    src: string;
    description: string;
    tags: string[];
    content: (() => JSX.Element) | JSX.Element;
    link?: {
        demo?: string;
        github?: string;
    };
};
