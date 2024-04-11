export enum Gender {
    Male = 'Male',
    Female = 'Female'
}

export interface User {
    id: number;
    role: string;
    email: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    phoneNumber: string;
    gender: Gender | null;
    birthday: Date;
}