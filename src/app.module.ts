import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GroceriesModule } from './groceries/groceries.module';
import { OrdersModule } from './orders/orders.module';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import JwtAuthGuard from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { SearchModule } from './search/search.module';
import { APP_ENV } from './constants/app.constants';
import { typeOrmConfig } from './config/typeorm.config';

console.log(process.env.NODE_ENV);
@Module({
    imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        ...(process.env.NODE_ENV === APP_ENV.DEV_ENV
          ? ['.env.development']
          : []),
        ...(process.env.NODE_ENV === APP_ENV.PROD_ENV
          ? ['.env.production']
          : []),
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
