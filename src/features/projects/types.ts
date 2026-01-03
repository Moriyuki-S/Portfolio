import type { Multilingual } from '$lib/i18n/type';

export type ProjectContentBlock =
    | { type: 'heading'; text: Multilingual }
    | { type: 'paragraph'; text: Multilingual }
    | { type: 'list'; items: Multilingual[] };

export type Project = {
    id: number;
    title: Multilingual;
    src: string;
    description: Multilingual;
    tags: Multilingual[];
    content: ProjectContentBlock[];
    link?: {
        demo?: string;
        github?: string;
    };
};
