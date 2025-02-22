export interface IValidateUser {
  email: string;
  id?: number;
}

export interface ICreateUser {
  email: string;
  password: string;
  salt: string;
  isActive: boolean;
}

export interface ILoginUser {
  email: string;
  password: string;
}
