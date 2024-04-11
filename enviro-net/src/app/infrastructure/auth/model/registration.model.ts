export enum Gender {
    Male = 'Male',
    Female = 'Female'
  }
  
  export interface Registration {
    name: string;
    surname: string;
    email: string;
    username: string;
    password: string;
    phoneNumber: string;
    gender: number | null;
    dateOfBirth: Date;
    points: number;
    role: number; 
  }
  