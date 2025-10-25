export type TimelineType = {
    id: number;
    title: string;
    description: string;
    date: {
        start: Date;
        end?: Date;
    };
    type: 'work' | 'education' | 'project';
    location?: {
        text: string;
        url: string;
    };
};
