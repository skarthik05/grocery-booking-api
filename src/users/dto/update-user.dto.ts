import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { USER_ROLE } from '../constants/user.constants';
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {
  @ApiProperty({
    description: 'Name of the user',
    required: false,
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'Role of the user',
    required: false,
    example: 'admin',
  })
  role?: USER_ROLE;

  @ApiProperty({
    description: 'Email of the user',
    required: false,
    example: 'jdoe@gmail.com',
  })
  email?: string;
}
