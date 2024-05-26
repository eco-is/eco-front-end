import { UserContact } from "./user-contact.model";

export interface Notification {
    id: number;
    createdOn: Date;
    user: UserContact;
    title: string;
    description: string;
    read: boolean;
    link: string | undefined;
}