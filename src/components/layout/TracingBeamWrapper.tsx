import { TracingBeam } from '$lib/components/tracing-beam';
import { cn } from '$lib/utils';
import type { FC, ReactNode } from 'react';

export const TracingBeamWrapper: FC<{ children: ReactNode }> = ({
    children,
}) => {
    return (
        <TracingBeam>
            <div className={cn(['pl-18'])}>{children}</div>
        </TracingBeam>
    );
};
