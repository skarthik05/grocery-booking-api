import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_KEYS } from './constants/env.constants';
import { APP_CONSTANTS } from './constants/app.constants';
import { GroceriesModule } from './groceries/groceries.module';
import { OrdersModule } from './orders/orders.module';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import JwtAuthGuard from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { SearchModule } from './search/search.module';
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
    OrdersModule,
    LoggerModule,
    UsersModule,
    AuthModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
