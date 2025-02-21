import { USER_ROLE } from '../constants/user.constants';

export interface IValidateUser {
  email: string;
  id?: number;
}

export interface ICreateUser {
  email: string;
  password: string;
  salt: string;
  isActive: boolean;
  role: USER_ROLE;
}

export interface ILoginUser {
  email: string;
  password: string;
}
