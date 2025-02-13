import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ENV_KEYS } from '../constants/env.constants';
@Injectable()
export class BcryptUtil {
  constructor(private readonly configService: ConfigService) {}

  async generateSalt(): Promise<string> {
    const saltRounds =
      +this.configService.get<number>(ENV_KEYS.BCRYPT_SALT_ROUNDS) || 10;
    return await bcrypt.genSalt(saltRounds);
  }
  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
