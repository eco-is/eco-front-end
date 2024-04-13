export enum Gender {
    Male = 'MALE',
    Female = 'FEMALE'
}

export interface UserInfo {
    id: number;
    role: string;
    email: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    phoneNumber: string;
    gender: Gender | null;
    dateOfBirth: Date;
}