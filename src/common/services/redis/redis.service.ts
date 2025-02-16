import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CustomLoggerService } from '../../logger/logger.service';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly expirationTime: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {
    const config = new RedisConfig(configService);
    this.client = new Redis(config.getRedisConfig());
    this.expirationTime = config.getExpirationTime();

    this.setupListeners();
  }

  private setupListeners() {
    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (error) => {
      this.logger.customError('Redis connection error', error.stack);
    });
  }
  async get(key: string): Promise<any> {
    try {
      this.logger.log('Getting Redis key', key);
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.customError('Redis get error', error.stack);
    }
  }

  async set(key: string, value: number): Promise<void> {
    try {
      this.logger.log('Setting Redis key', key);
      await this.client.setex(key, this.expirationTime, value);
    } catch (error) {
      this.logger.customError('Redis set error', error.stack);
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.logger.log('Deleting Redis key', key);
      await this.client.del(key);
    } catch (error) {
      this.logger.customError('Redis delete error', error.stack);
    }
  }

  onModuleDestroy() {
    this.logger.log('Disconnecting from Redis');
    this.client.disconnect();
  }
}
