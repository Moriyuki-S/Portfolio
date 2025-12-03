import type { ContactFormData } from './type';

export interface ContactRepository {
    notify(payload: ContactFormData): Promise<void>;
}
