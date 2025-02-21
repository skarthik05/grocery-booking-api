import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { ENV_KEYS } from '../constants/env.constants';
import { CustomLoggerService } from '../common/logger/logger.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_ENV } from '../constants/app.constants';

dotenv.config();
const logger = new CustomLoggerService();

const isLocal = process.env.NODE_ENV === APP_ENV.LOCAL_ENV;
export const typeOrmConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'postgres',
  host: process.env[ENV_KEYS.DATABASE.HOST],
  port: parseInt(process.env[ENV_KEYS.DATABASE.PORT], 10),
  username: process.env[ENV_KEYS.DATABASE.USERNAME],
  password: process.env[ENV_KEYS.DATABASE.PASSWORD],
  database: process.env[ENV_KEYS.DATABASE.NAME],
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', '..', 'database', 'migrations', '*.{ts,js}')],
  synchronize: isLocal,
  logger: {
    log: (level: string, message: string) => {
      logger.log(`[TypeORM] ${message}`);
    },
    logQuery: (query: string, parameters?: any[]) => {
      logger.log(`[Query] ${query} -- Parameters: ${JSON.stringify(parameters)}`);
    },
    logQueryError: (error: string, query: string, parameters?: any[]) => {
      logger.error(`[Query Error] ${error} in ${query} -- Parameters: ${JSON.stringify(parameters)}`);
    },
    logQuerySlow: (time: number, query: string, parameters?: any[]) => {
      logger.warn(`[Slow Query] Time: ${time}ms -- ${query} -- Parameters: ${JSON.stringify(parameters)}`);
    },
    logMigration: (message: string) => {
      logger.log(`[Migration] ${message}`);
    },
    logSchemaBuild: (message: string) => {
      logger.log(`[Schema] ${message}`);
    },
  },
};
console.log('Migrations pathhhhhhhhhhhhhh:', join(__dirname, '..','..','database', 'migrations', '*.{ts,js}'));
export const AppDataSource = new DataSource(typeOrmConfig);