export type ProjectContentBlock =
    | { type: 'heading'; text: string }
    | { type: 'paragraph'; text: string }
    | { type: 'list'; items: string[] };

export type Project = {
    id: number;
    title: string;
    src: string;
    description: string;
    tags: string[];
    content: ProjectContentBlock[];
    link?: {
        demo?: string;
        github?: string;
    };
};
