import {
    REST,
    Routes,
    type RESTPostAPIChannelMessageJSONBody,
} from 'discord.js';

export type DiscordServiceOptions = {
    botToken?: string;
    channelId?: string;
};

export interface DiscordMessageClient {
    sendMessage(payload: RESTPostAPIChannelMessageJSONBody): Promise<void>;
}

export class DiscordService implements DiscordMessageClient {
    private readonly rest: REST;
    private readonly channelId: string;

    constructor({ botToken, channelId }: Required<DiscordServiceOptions>) {
        this.rest = new REST({ version: '10' }).setToken(botToken);
        this.channelId = channelId;
    }

    async sendMessage(payload: RESTPostAPIChannelMessageJSONBody) {
        await this.rest.post(Routes.channelMessages(this.channelId), {
            body: payload,
        });
    }
}

export const createDiscordService = (
    botToken: string,
    channelId: string,
): DiscordMessageClient => {

    return new DiscordService({ botToken, channelId });
};
