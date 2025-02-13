import { UserRole } from 'src/entities/user.entity';

export interface IValidateUser {
  email: string;
  id?: number;
}

export interface ICreateUser {
  email: string;
  password: string;
  salt: string;
  isActive: boolean;
  role: UserRole;
}
