import { cn } from '$lib/utils';
import { navigate } from 'astro:transitions/client';
import {
    FormProvider,
    FormStateInput,
    getFormProps,
    getInputProps,
    getTextareaProps,
    useForm,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type FC, useCallback, useState } from 'react';
import { schema } from 'src/features/contact/type';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import {
    ContactTabs,
    type ContactTabMeta,
} from 'src/components/ui/contact-tabs';

const LINKEDIN_URL =
    import.meta.env.PUBLIC_LINKEDIN_URL ?? 'https://www.linkedin.com/';

export const ContactSection: FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'form' | 'linkedin'>('form');

    const sendForm = useCallback(async (payload: FormData) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: payload,
            });

            const data = (await response.json().catch(() => null)) as {
                success?: boolean;
                error?: string;
            } | null;

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.error ??
                        '送信に失敗しました。時間をおいて再度お試しください。',
                );
            }

            return true;
        } catch (error) {
            console.error(error);
            const fallbackMessage =
                error instanceof Error && error.message
                    ? error.message
                    : '送信に失敗しました。時間をおいて再度お試しください。';
            setSubmitError(fallbackMessage);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const handleTabChange = (tab: 'form' | 'linkedin') => {
        setActiveTab(tab);
    };

    const [form, fields] = useForm({
        constraint: getZodConstraint(schema),
        // Validate field once user leaves the field
        shouldValidate: 'onBlur',
        // Then, revalidate field as user types again
        shouldRevalidate: 'onInput',

        onValidate({ formData }) {
            return parseWithZod(formData, { schema });
        },
        onSubmit(event, result) {
            event.preventDefault();

            if (!result.submission || result.submission.status !== 'success') {
                return;
            }

            setSubmitError(null);
            const payload = new FormData(event.currentTarget);
            void sendForm(payload).then((wasSuccessful) => {
                if (wasSuccessful) {
                    navigate('/thank-you');
                }
            });
        },
    });

    const baseFieldClasses = [
        'w-full',
        'rounded-2xl',
        'border',
        'bg-white/80',
        'px-4',
        'py-3',
        'text-sm',
        'transition',
        'focus-visible:outline-none',
        'focus-visible:ring-4',
        'dark:bg-slate-900/80',
    ];

    const getFieldClasses = (hasError?: boolean) => [
        ...baseFieldClasses,
        ...(hasError
            ? [
                  'border-red-400',
                  'focus-visible:ring-red-400/30',
                  'dark:border-red-500',
              ]
            : [
                  'border-slate-200',
                  'focus-visible:ring-indigo-400/20',
                  'dark:border-slate-800',
              ]),
    ];

    const renderError = (errorId?: string, errors?: string[]) =>
        errors ? (
            <p
                id={errorId}
                className={cn([
                    'mt-1',
                    'text-red-500',
                    'text-sm',
                    'dark:text-red-400',
                ])}
            >
                {errors[0]}
            </p>
        ) : null;

    const tabs: ContactTabMeta<'form' | 'linkedin'>[] = [
        {
            id: 'form',
            label: (
                <>
                    <FaEnvelope className={cn(['text-base'])} />
                    フォーム
                </>
            ),
            panelId: 'contact-panel-form',
            tabId: 'contact-tab-form',
            content: (
                <FormProvider context={form.context}>
                    <form
                        {...getFormProps(form)}
                        method="post"
                        className={cn([
                            'rounded-[32px]',
                            'border',
                            'border-slate-200/60',
                            'bg-white/90',
                            'p-6',
                            'shadow-2xl',
                            'backdrop-blur-md',
                            'sm:p-8',
                            'dark:border-slate-800/80',
                            'dark:bg-slate-900/80',
                        ])}
                    >
                        <FormStateInput formId={form.id} />
                        <div className={cn(['space-y-2'])}>
                            <p
                                className={cn([
                                    'font-semibold',
                                    'text-slate-500',
                                    'text-sm',
                                    'uppercase',
                                    'tracking-[0.3em]',
                                    'dark:text-slate-400',
                                ])}
                            >
                                Get in touch
                            </p>
                            <h3
                                className={cn([
                                    'font-bold',
                                    'text-2xl',
                                    'text-slate-900',
                                    'dark:text-white',
                                ])}
                            >
                                お問い合わせ
                            </h3>
                            <p
                                className={cn([
                                    'text-slate-500',
                                    'text-sm',
                                    'dark:text-slate-400',
                                ])}
                            >
                                * は必須項目です。
                            </p>
                        </div>

                        {form.errors && (
                            <div
                                className={cn([
                                    'mt-6',
                                    'rounded-2xl',
                                    'border',
                                    'border-red-200',
                                    'bg-red-50',
                                    'px-4',
                                    'py-3',
                                    'text-red-700',
                                    'text-sm',
                                    'dark:border-red-500/40',
                                    'dark:bg-red-500/10',
                                    'dark:text-red-200',
                                ])}
                                role="alert"
                                id={form.errorId}
                            >
                                入力内容を確認してください。
                            </div>
                        )}

                        {submitError && (
                            <div
                                className={cn([
                                    'mt-4',
                                    'rounded-2xl',
                                    'border',
                                    'border-amber-200',
                                    'bg-amber-50',
                                    'px-4',
                                    'py-3',
                                    'text-amber-800',
                                    'text-sm',
                                    'dark:border-amber-500/40',
                                    'dark:bg-amber-500/10',
                                    'dark:text-amber-200',
                                ])}
                                role="alert"
                                aria-live="assertive"
                            >
                                {submitError}
                            </div>
                        )}

                        <div className={cn(['mt-6', 'space-y-6'])}>
                            <div>
                                <label
                                    htmlFor={fields.name.id}
                                    className={cn([
                                        'mb-2',
                                        'block',
                                        'font-medium',
                                        'text-slate-700',
                                        'text-sm',
                                        'dark:text-slate-100',
                                    ])}
                                >
                                    お名前 *
                                </label>
                                <input
                                    {...getInputProps(fields.name, {
                                        type: 'text',
                                    })}
                                    className={cn([
                                        ...getFieldClasses(
                                            Boolean(fields.name.errors),
                                        ),
                                    ])}
                                    placeholder="山田 太郎"
                                />
                                {renderError(
                                    fields.name.errorId,
                                    fields.name.errors,
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor={fields.email.id}
                                    className={cn([
                                        'mb-2',
                                        'block',
                                        'font-medium',
                                        'text-slate-700',
                                        'text-sm',
                                        'dark:text-slate-100',
                                    ])}
                                >
                                    メールアドレス *
                                </label>
                                <input
                                    {...getInputProps(fields.email, {
                                        type: 'email',
                                    })}
                                    className={cn([
                                        ...getFieldClasses(
                                            Boolean(fields.email.errors),
                                        ),
                                    ])}
                                    placeholder="you@example.com"
                                />
                                {renderError(
                                    fields.email.errorId,
                                    fields.email.errors,
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor={fields.message.id}
                                    className={cn([
                                        'mb-2',
                                        'block',
                                        'font-medium',
                                        'text-slate-700',
                                        'text-sm',
                                        'dark:text-slate-100',
                                    ])}
                                >
                                    お問い合わせ内容 *
                                </label>
                                <textarea
                                    {...getTextareaProps(fields.message)}
                                    rows={6}
                                    className={cn([
                                        ...getFieldClasses(
                                            Boolean(fields.message.errors),
                                        ),
                                        'resize-none',
                                    ])}
                                    placeholder="ご希望の内容や現在の課題などをご記入ください。"
                                />
                                {renderError(
                                    fields.message.errorId,
                                    fields.message.errors,
                                )}
                            </div>
                        </div>

                        <div
                            className={cn([
                                'mt-8',
                                'flex',
                                'flex-col',
                                'gap-4',
                                'sm:flex-row',
                                'sm:items-center',
                                'sm:justify-between',
                            ])}
                        >
                            <p
                                className={cn([
                                    'text-slate-500',
                                    'text-xs',
                                    'dark:text-slate-400',
                                ])}
                            >
                                送信ボタンを押すことで、プライバシーポリシーに同意したとみなされます。
                            </p>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn([
                                    'inline-flex',
                                    'items-center',
                                    'justify-center',
                                    'rounded-full',
                                    'bg-slate-900',
                                    'px-8',
                                    'py-3',
                                    'font-semibold',
                                    'text-sm',
                                    'text-white',
                                    'transition',
                                    'hover:bg-slate-800',
                                    'focus-visible:outline-none',
                                    'focus-visible:ring-4',
                                    'focus-visible:ring-indigo-400/40',
                                    'disabled:cursor-not-allowed',
                                    'disabled:opacity-60',
                                    'dark:bg-white',
                                    'dark:text-slate-900',
                                    'dark:hover:bg-slate-200',
                                ])}
                            >
                                {isSubmitting ? '送信中…' : '送信する'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            ),
        },
        {
            id: 'linkedin',
            label: (
                <>
                    <FaLinkedin className={cn(['text-base'])} />
                    LinkedIn
                </>
            ),
            panelId: 'contact-panel-linkedin',
            tabId: 'contact-tab-linkedin',
            content: (
                <div
                    className={cn([
                        'rounded-[32px]',
                        'border',
                        'border-slate-200/60',
                        'bg-white/90',
                        'p-6',
                        'shadow-2xl',
                        'backdrop-blur-md',
                        'sm:p-8',
                        'dark:border-slate-800/80',
                        'dark:bg-slate-900/70',
                    ])}
                >
                    <div
                        className={cn([
                            'flex',
                            'flex-col',
                            'gap-4',
                            'text-slate-700',
                            'dark:text-slate-100',
                        ])}
                    >
                        <p
                            className={cn([
                                'text-xs',
                                'uppercase',
                                'tracking-[0.3em]',
                                'text-slate-500',
                                'dark:text-slate-400',
                            ])}
                        >
                            Get in touch
                        </p>
                        <div
                            className={cn([
                                'flex',
                                'items-center',
                                'gap-2',
                                'text-2xl',
                                'justify-center',
                                'font-semibold',
                            ])}
                        >
                            <FaLinkedin
                                className={cn(['text-2xl', 'text-[#0A66C2]'])}
                            />
                            <span>LinkedIn でお問い合わせ</span>
                        </div>
                        <p
                            className={cn([
                                'text-sm',
                                'text-slate-500',
                                'dark:text-slate-400',
                            ])}
                        >
                            プロフィールや実績を確認しながら相談したい方はこちら
                        </p>

                        <p className={cn(['text-sm', 'leading-relaxed'])}>
                            迅速な連絡やキャリアの相談、コラボレーションのお話など、LinkedInでのメッセージを歓迎しています。まずはお気軽にメッセージをお送りください。
                        </p>

                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={cn([
                                'inline-flex',
                                'items-center',
                                'justify-center',
                                'gap-2',
                                'rounded-full',
                                'bg-[#0A66C2]',
                                'px-6',
                                'py-3',
                                'text-sm',
                                'font-semibold',
                                'text-white',
                                'transition',
                                'hover:bg-[#094c91]',
                                'focus-visible:outline-none',
                                'focus-visible:ring-4',
                                'focus-visible:ring-[#0A66C2]/30',
                            ])}
                        >
                            <FaLinkedin
                                className={cn(['text-lg', 'text-white'])}
                            />
                            LinkedIn でメッセージする
                        </a>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section className={cn(['relative'])}>
            <div
                className={cn([
                    '-z-10',
                    'pointer-events-none',
                    'absolute',
                    'inset-0',
                ])}
            >
                <div
                    className={cn([
                        '-translate-x-1/2',
                        'absolute',
                        'top-0',
                        'left-1/2',
                        'h-64',
                        'w-64',
                        'rounded-full',
                        'bg-indigo-500/30',
                        'blur-[120px]',
                        'dark:bg-indigo-500/10',
                    ])}
                />
            </div>
            <div className={cn(['mx-auto', 'w-full', 'max-w-3xl'])}>
                <ContactTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onSelect={handleTabChange}
                    tabListLabel="お問い合わせ or LinkedIn を選択"
                />
            </div>
        </section>
    );
};
