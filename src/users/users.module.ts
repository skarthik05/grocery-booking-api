import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { LoggerModule } from 'src/common/logger/logger.module';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import { UserRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LoggerModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, BcryptUtil],
})
export class UsersModule {}
