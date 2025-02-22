import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from '../entities/user.entity';
import {
  IdResponseDto,
  ExistsResponseDto,
} from 'src/common/dto/api.response.dto';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import {
  ResourceAlreadyExistsException,
  ResourceNotFoundException,
  InvalidCredentialsException,
} from 'src/common/exceptions';
import {
  IValidateUser,
  ICreateUser,
  ILoginUser,
} from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { ITokenPayload } from 'src/auth/interface/token-payload.interface';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptUtil: BcryptUtil,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('UserService');
  }
  async validateUser(user: IValidateUser): Promise<ExistsResponseDto> {
    this.logger.log(`Validating user with email: ${user.email}`);
    try {
      const existingUser = await this.userRepository.validateUser(user);
      if (existingUser) {
        this.logger.warn(`User with email ${user.email} already exists`);
        throw new ResourceAlreadyExistsException('User email');
      }
      return { isExists: true };
    } catch (error) {
      this.logger.customError('Failed to validate user', error);
      throw error;
    }
  }

  async createUser(createUserDto: ICreateUser): Promise<IdResponseDto> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    try {
      const salt = await this.bcryptUtil.generateSalt();
      const hashedPassword = await this.bcryptUtil.hashPassword(
        createUserDto.password,
        salt,
      );
      const user = {
        ...createUserDto,
        password: hashedPassword,
        salt,
        isActive: true,
      } as ICreateUser;
      await this.validateUser({ email: createUserDto.email });
      const savedUser = await this.userRepository.create(user);
      this.logger.log(`User created with ID: ${savedUser.id}`);
      return { id: savedUser.id };
    } catch (error) {
      this.logger.customError('Failed to create user', error);
      throw error;
    }
  }

  async findUserById(id: number): Promise<User> {
    this.logger.log(`Finding user with ID: ${id}`);
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw new ResourceNotFoundException('User');
      }
      return user;
    } catch (error) {
      this.logger.customError('Failed to find user by ID', error);
      throw error;
    }
  }

  async findAllUsers(): Promise<User[]> {
    this.logger.log('Finding all users');
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      this.logger.customError('Failed to find all users', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);
    try {
      await this.userRepository.remove(id);
    } catch (error) {
      this.logger.customError('Failed to delete user', error);
      throw error;
    }
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw new ResourceNotFoundException('User');
      }
      await this.validateUser({ email: updateUserDto.email, id: user.id });
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      this.logger.customError('Failed to update user', error);
      throw error;
    }
  }

  async validateUserCredentials(loginDto: ILoginUser): Promise<ITokenPayload> {
    this.logger.log(`Validating credentials for email: ${loginDto.email}`);
    try {
      const user = await this.userRepository.findByEmail(loginDto.email);
      if (!user) {
        throw new ResourceNotFoundException('User');
      }

      const hashedPassword = await this.bcryptUtil.hashPassword(
        loginDto.password,
        user.salt,
      );

      if (hashedPassword !== user.password) {
        throw new InvalidCredentialsException();
      }

      return {
        id: user.id,
        role: user.role,
      };
    } catch (error) {
      this.logger.customError('Failed to validate user credentials', error);
      throw error;
    }
  }
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }
}
