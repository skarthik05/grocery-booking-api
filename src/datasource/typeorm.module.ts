// src/datasource/typeorm.module.ts
import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from 'src/constants/env.constants';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: configService.get(ENV_KEYS.DATABASE.HOST),
            port: configService.get(ENV_KEYS.DATABASE.PORT),
            username: configService.get(ENV_KEYS.DATABASE.USERNAME),
            password: configService.get(ENV_KEYS.DATABASE.PASSWORD),
            database: configService.get(ENV_KEYS.DATABASE.NAME),
            synchronize: true,
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
          });
          await dataSource.initialize();
          console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
