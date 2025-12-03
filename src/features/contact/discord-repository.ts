import type { DiscordMessageClient } from '$lib/services/discord';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import type { ContactRepository } from './repository';

export const createDiscordContactRepository = (
    discord: DiscordMessageClient,
): ContactRepository => {
    return {
        async notify(payload) {
            const embed = new EmbedBuilder()
                .setTitle('新しいお問い合わせ')
                .setColor(0x6366f1)
                .setDescription(payload.message)
                .addFields(
                    { name: 'お名前', value: payload.name, inline: true },
                    {
                        name: 'メールアドレス',
                        value: payload.email,
                        inline: true,
                    },
                )
                .setTimestamp(new Date());

            const confirmRow =
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId('contact-confirmed')
                        .setLabel('確認済み')
                        .setEmoji('✅')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),
                );

            await discord.sendMessage({
                content: '📬 新しいお問い合わせが届きました。',
                embeds: [embed.toJSON()],
                components: [confirmRow.toJSON()],
            });
        },
    };
};
