export enum Gender {
    Male = 'Male',
    Female = 'Female'
  }
  
  export interface Registration {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber: string;
    gender: Gender | null;
    dateOfBirth: Date;
  }
  