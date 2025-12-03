import { z } from 'zod';

export const schema = z.object({
    email: z.preprocess(
        (val) => (typeof val === 'string' ? val.toLowerCase() : val),
        z
            .string({ required_error: 'メールアドレスを入力してください' })
            .email('有効なメールアドレスを入力してください'),
    ),
    name: z.preprocess(
        (val) => (typeof val === 'string' ? val.trim() : val),
        z.string({ required_error: 'お名前を入力してください' }),
    ),
    message: z.preprocess(
        (val) => (typeof val === 'string' ? val.trim() : val),
        z
            .string({ required_error: 'お問い合わせ内容を入力してください' })
            .min(10, 'メッセージは少なくとも10文字である必要があります')
            .max(1000, 'メッセージは最大1000文字までです'),
    ),
});

export type ContactFormData = z.infer<typeof schema>;
