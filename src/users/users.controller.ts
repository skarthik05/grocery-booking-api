import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';
import { IdResponseDto } from 'src/common/dto/api.response.dto';
import { UserResponses } from './responses/user.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { APP_ROLES, ROUTES } from '../constants/app.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiCookieAuth()
@ApiTags(ROUTES.USERS)
@Controller(ROUTES.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(APP_ROLES.ADMIN)
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

  @Roles(APP_ROLES.ADMIN)
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

  @Roles(APP_ROLES.ADMIN)
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
  @Roles(APP_ROLES.ADMIN)
  @Patch(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('id') userId: number,
  ): Promise<User> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Roles(APP_ROLES.ADMIN)
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
