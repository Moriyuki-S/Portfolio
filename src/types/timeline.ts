import type { Multilingual } from '$lib/i18n/type';

export type TimelineType = {
    id: number;
    title: Multilingual;
    description: Multilingual;
    date: {
        start: Date;
        end?: Date;
    };
    type: 'work' | 'education' | 'project';
    location?: {
        text: Multilingual;
        url: string;
    };
};
