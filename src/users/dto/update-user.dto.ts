import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserRole } from 'src/entities/user.entity';
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
  role?: UserRole;

  @ApiProperty({
    description: 'Email of the user',
    required: false,
    example: 'jdoe@gmail.com',
  })
  email?: string;
}
