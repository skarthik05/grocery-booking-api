import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { CustomLoggerService } from '../../logger/logger.service';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RedisService,
      useFactory: (
        configService: ConfigService,
        logger: CustomLoggerService,
      ) => {
        return new RedisService(configService, logger);
      },
      inject: [ConfigService, CustomLoggerService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
