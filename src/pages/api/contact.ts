import { createDiscordService } from '$lib/services/discord';
import type { APIRoute } from 'astro';
import { createDiscordContactRepository } from 'src/features/contact/discord-repository';
import { schema } from 'src/features/contact/type';
import { createContactService } from 'src/services/contact';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();

    const result = schema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    });

    if (!result.success) {
        return new Response(
            JSON.stringify({
                success: false,
                error: '入力内容を確認してください。',
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }

    try {
        const botToken = import.meta.env.DISCORD_BOT_TOKEN;
        const channelId = import.meta.env.DISCORD_CHANNEL_ID;
        if (!botToken || !channelId) {
            console.error('Discord bot configuration is missing.');
            throw new Error(
                'DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID is not configured.',
            );
        }

        const discordClient = createDiscordService(botToken, channelId);
        const contactRepository = createDiscordContactRepository(discordClient);
        const contactService = createContactService({
            repository: contactRepository,
        });
        await contactService.submit(result.data);
    } catch (error) {
        console.error('Error sending Discord notification:', error);

        return new Response(
            JSON.stringify({
                success: false,
                error: '送信に失敗しました。もう一度お試しください。',
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }

    return new Response(
        JSON.stringify({
            success: true,
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
};

export const ALL: APIRoute = () =>
    new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed',
    });
