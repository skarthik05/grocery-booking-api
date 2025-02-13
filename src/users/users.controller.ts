import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ROUTES } from '../constants/app.constants';
import { IdResponseDto } from 'src/common/dto/api.response.dto';
import { UserResponses } from './responses/user.response';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags(ROUTES.USERS)
@Controller(ROUTES.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: UserResponses.createUserSuccess,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
    schema: {
      example: UserResponses.validateUserError,
    },
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IdResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    schema: {
      example: UserResponses.findUserSuccess,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: UserResponses.findOneError,
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'All users found successfully',
    schema: {
      example: UserResponses.findUserSuccess,
    },
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: UserResponses.updateUserSuccess,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: UserResponses.findOneError,
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: UserResponses.deleteUserSuccess,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: UserResponses.deleteUserSuccess,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: UserResponses.findOneError,
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
