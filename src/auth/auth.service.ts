import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin-auth.dto';
import { UserService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from './interface/token-payload.interface';
import { IdResponseDto } from 'src/common/dto/api.response.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly logger: CustomLoggerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signin(createAuthDto: SignInDto): Promise<string> {
    const user = await this.usersService.validateUserCredentials(createAuthDto);
    return this.getCookieWithJwtToken(user.id);
  }

  signup(createUserDto: CreateUserDto): Promise<IdResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      this.logger.log(`Authenticating user with email: ${email}`);
      return await this.usersService.validateUserCredentials({
        email,
        password,
      });
    } catch (error) {
      this.logger.customError('Failed to authenticate user', error);
      throw error;
    }
  }
  getCookieWithJwtToken(userId: number) {
    const payload: ITokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }
  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
