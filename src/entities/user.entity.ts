import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENTITY_CONSTANTS } from 'src/constants/entity.constants';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity(ENTITY_CONSTANTS.TABLE_NAMES.USER)
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  isActive: boolean;

  @Column({ select: false })
  salt: string;
}
