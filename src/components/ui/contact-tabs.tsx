import { cn } from '$lib/utils';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export type ContactTabMeta<T extends string = string> = {
    id: T;
    label: ReactNode;
    panelId: string;
    tabId: string;
    content: ReactNode;
};

type ContactTabsProps<T extends string = string> = {
    tabs: ContactTabMeta<T>[];
    activeTab: T;
    onSelect: (tab: T) => void;
    tabListLabel: string;
};

const panelVariants = {
    active: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
    inactive: {
        opacity: 0,
        scale: 0.98,
        y: 20,
        filter: 'blur(4px)',
    },
};

export const ContactTabs = <T extends string>({
    tabs,
    activeTab,
    onSelect,
    tabListLabel,
}: ContactTabsProps<T>) => (
    <>
        <div
            className={cn([
                'flex',
                'w-full',
                'items-center',
                'gap-2',
                'rounded-full',
                'bg-slate-100/80',
                'p-1',
                'dark:bg-slate-900/60',
            ])}
            role="tablist"
            aria-label={tabListLabel}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelect(tab.id)}
                    role="tab"
                    id={tab.tabId}
                    aria-controls={tab.panelId}
                    aria-selected={activeTab === tab.id}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                    className={cn([
                        'flex-1',
                        'rounded-full',
                        'px-4',
                        'py-2',
                        'text-sm',
                        'font-semibold',
                        'transition',
                        activeTab === tab.id
                            ? [
                                  'bg-white',
                                  'text-slate-900',
                                  'shadow-md',
                                  'dark:bg-slate-800',
                                  'dark:text-white',
                              ]
                            : [
                                  'text-slate-500',
                                  'hover:text-slate-800',
                                'dark:text-slate-400',
                            ],
                    ])}
                >
                    <span
                        className={cn([
                            'inline-flex',
                            'items-center',
                            'justify-center',
                            'gap-2',
                        ])}
                    >
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>

        <div className={cn(['relative', 'mt-6', 'grid'])}>
            {tabs.map((tab) => (
                <motion.div
                    key={tab.id}
                    className={cn(['col-start-1', 'row-start-1'])}
                    initial={false}
                    animate={activeTab === tab.id ? 'active' : 'inactive'}
                    variants={panelVariants}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        pointerEvents: activeTab === tab.id ? 'auto' : 'none',
                    }}
                    role="tabpanel"
                    aria-labelledby={tab.tabId}
                    id={tab.panelId}
                    aria-hidden={activeTab !== tab.id}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                >
                    {tab.content}
                </motion.div>
            ))}
        </div>
    </>
);
