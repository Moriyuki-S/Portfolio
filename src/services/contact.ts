import type { ContactDiscordNotifier } from 'src/features/contact/discord-notifier';
import type { ContactFormData } from 'src/features/contact/type';

export interface ContactService {
    submit(payload: ContactFormData): Promise<void>;
}

type Dependencies = {
    notifier: ContactDiscordNotifier;
};

export const createContactService = ({
    notifier,
}: Dependencies): ContactService => ({
    submit: (payload) => notifier.send(payload),
});
