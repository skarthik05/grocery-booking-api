import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { USER_ROLE } from 'src/users/constants/user.constants';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    required: true,
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    required: true,
    example: '123456',
  })
  @ApiProperty({
    description: 'Password of the user',
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Name of the user',
    required: true,
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Role of the user',
    required: true,
    example: 'admin',
    enum: USER_ROLE,
  })
  @IsEnum(USER_ROLE)
  role: USER_ROLE;
}
