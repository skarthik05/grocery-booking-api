import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import { ENV_KEYS } from '../../../constants/env.constants';

export class RedisConfig {
  constructor(private readonly configService: ConfigService) {}

  getRedisConfig(): RedisOptions {
    return {
      host: this.configService.get(ENV_KEYS.REDIS.HOST),
      port: this.configService.get(ENV_KEYS.REDIS.PORT),
      password: this.configService.get(ENV_KEYS.REDIS.PASSWORD),
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
    };
  }

  getExpirationTime(): number {
    return this.configService.get(ENV_KEYS.REDIS.EXPIRATION_TIME);
  }
}
