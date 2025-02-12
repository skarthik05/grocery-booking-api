import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_KEYS } from './constants/env.constants';
import { APP_CONSTANTS } from './constants/app.constants';
import { GroceriesModule } from './groceries/groceries.module';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './users/users.module';
const getEnvFilePath = (configService: ConfigService): string => {
  switch (configService.get(ENV_KEYS.NODE_ENV)) {
    case APP_CONSTANTS.PROD_ENV:
      return '.env.production';
    case APP_CONSTANTS.DEV_ENV:
      return '.env.development';
    default:
      return '.env';
  }
};

@Module({
  imports: [
    TypeOrmModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          envFilePath: getEnvFilePath(new ConfigService()),
        }),
      ],
    }),
    GroceriesModule,
    LoggerModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
