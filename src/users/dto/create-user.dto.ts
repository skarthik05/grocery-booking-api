import { IsEmail, IsNotEmpty } from 'class-validator';
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
}
