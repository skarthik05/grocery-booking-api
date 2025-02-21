import { FindOptionsWhere, Not, Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdResponseDto } from '../common/dto/api.response.dto';
import { ICreateUser, IValidateUser } from './interfaces/user.interface';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createUserDto: ICreateUser): Promise<IdResponseDto> {
    try {
      const user = this.repository.create(createUserDto);
      const savedUser = await this.repository.save(user);
      return { id: savedUser.id };
    } catch (error) {
      throw error;
    }
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      Object.assign(user, updateUserDto);
      return await this.repository.save(user);
    } catch (error) {
      throw error;
    }
  }
  async findOne(id: number): Promise<User> {
    return await this.repository.findOne({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }
  async remove(id: number): Promise<UpdateResult> {
    try {
      return await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
  async validateUser(user: IValidateUser): Promise<User> {
    const where: FindOptionsWhere<User> = {};

    if (user.id) {
      where.id = Not(user.id);
    }
    if (user.email) {
      where.email = user.email;
    }

    return await this.repository.findOne({ where });
  }
  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'salt', 'role'],
    });
  }
}
