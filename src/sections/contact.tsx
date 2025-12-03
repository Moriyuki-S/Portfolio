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

export const ContactSection: FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

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

    const baseFieldClasses =
        'w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-4 dark:bg-slate-900/80';

    const getFieldClasses = (hasError?: boolean) =>
        cn(
            baseFieldClasses,
            hasError
                ? 'border-red-400 focus-visible:ring-red-400/30 dark:border-red-500'
                : 'border-slate-200 focus-visible:ring-indigo-400/20 dark:border-slate-800',
        );

    const renderError = (errorId?: string, errors?: string[]) =>
        errors ? (
            <p
                id={errorId}
                className="mt-1 text-red-500 text-sm dark:text-red-400"
            >
                {errors[0]}
            </p>
        ) : null;

    return (
        <section className="relative">
            <div className="-z-10 pointer-events-none absolute inset-0">
                <div className="-translate-x-1/2 absolute top-0 left-1/2 h-64 w-64 rounded-full bg-indigo-500/30 blur-[120px] dark:bg-indigo-500/10" />
            </div>
            <div className="mx-auto w-full max-w-3xl">
                <FormProvider context={form.context}>
                    <form
                        {...getFormProps(form)}
                        method="post"
                        className="rounded-[32px] border border-slate-200/60 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/80"
                    >
                        <FormStateInput formId={form.id} />
                        <div className="space-y-2">
                            <p className="font-semibold text-slate-500 text-sm uppercase tracking-[0.3em] dark:text-slate-400">
                                Get in touch
                            </p>
                            <h3 className="font-bold text-2xl text-slate-900 dark:text-white">
                                お問い合わせ
                            </h3>
                            <p className="text-slate-500 text-sm dark:text-slate-400">
                                * は必須項目です。
                            </p>
                        </div>

                        {form.errors && (
                            <div
                                className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
                                role="alert"
                                id={form.errorId}
                            >
                                入力内容を確認してください。
                            </div>
                        )}

                        {submitError && (
                            <div
                                className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
                                role="alert"
                                aria-live="assertive"
                            >
                                {submitError}
                            </div>
                        )}

                        <div className="mt-6 space-y-6">
                            <div>
                                <label
                                    htmlFor={fields.name.id}
                                    className="font-medium text-slate-700 text-sm dark:text-slate-100"
                                >
                                    お名前 *
                                </label>
                                <input
                                    {...getInputProps(fields.name, {
                                        type: 'text',
                                    })}
                                    className={getFieldClasses(
                                        Boolean(fields.name.errors),
                                    )}
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
                                    className="font-medium text-slate-700 text-sm dark:text-slate-100"
                                >
                                    メールアドレス *
                                </label>
                                <input
                                    {...getInputProps(fields.email, {
                                        type: 'email',
                                    })}
                                    className={getFieldClasses(
                                        Boolean(fields.email.errors),
                                    )}
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
                                    className="font-medium text-slate-700 text-sm dark:text-slate-100"
                                >
                                    お問い合わせ内容 *
                                </label>
                                <textarea
                                    {...getTextareaProps(fields.message)}
                                    rows={6}
                                    className={cn(
                                        getFieldClasses(
                                            Boolean(fields.message.errors),
                                        ),
                                        'resize-none',
                                    )}
                                    placeholder="ご希望の内容や現在の課題などをご記入ください。"
                                />
                                {renderError(
                                    fields.message.errorId,
                                    fields.message.errors,
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-slate-500 text-xs dark:text-slate-400">
                                送信ボタンを押すことで、プライバシーポリシーに同意したとみなされます。
                            </p>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 font-semibold text-sm text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                            >
                                {isSubmitting ? '送信中…' : '送信する'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </section>
    );
};
