import type { ContactRepository } from 'src/features/contact/repository';
import type { ContactFormData } from 'src/features/contact/type';

export interface ContactService {
    submit(payload: ContactFormData): Promise<void>;
}

type Dependencies = {
    repository: ContactRepository;
};

export const createContactService = ({
    repository,
}: Dependencies): ContactService => ({
    submit: (payload) => repository.notify(payload),
});
