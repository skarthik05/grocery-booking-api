import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { LoggerModule } from '../common/logger/logger.module';
import { BcryptUtil } from '../utils/bcrypt.util';
import { UserRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LoggerModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, BcryptUtil],
  exports: [UserService],
})
export class UsersModule {}
