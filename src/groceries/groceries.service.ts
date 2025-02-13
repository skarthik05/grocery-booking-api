import { Injectable } from '@nestjs/common';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { GroceriesRepository } from './groceries.repository';
import { Grocery } from '../entities/grocery.entity';
import { ExistsResponseDto } from './dto/response.dto';
import {
  ResourceAlreadyExistsException,
  ResourceNotFoundException,
} from 'src/common/exceptions';
import { CustomLoggerService } from '../common/logger/logger.service';
import { IdResponseDto } from '../common/dto/api.response.dto';
@Injectable()
export class GroceriesService {
  constructor(
    private readonly groceriesRepository: GroceriesRepository,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('GroceriesService');
  }

  async create(createGroceryDto: CreateGroceryDto): Promise<IdResponseDto> {
    this.logger.log(`Creating grocery with name: ${createGroceryDto.name}`);
    try {
      await this.validateGroceryName(createGroceryDto.name);
      const result = await this.groceriesRepository.create(createGroceryDto);
      this.logger.log(`Created grocery with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.customError('Failed to create grocery', error.stack);
      throw error;
    }
  }

  findAll(): Promise<Grocery[]> {
    try {
      this.logger.log('Finding all groceries');
      return this.groceriesRepository.findAll();
    } catch (error) {
      this.logger.customError('Failed to find all groceries', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Grocery> {
    try {
      const grocery = await this.groceriesRepository.findOne(id);
      if (!grocery) {
        this.logger.log(`Grocery with ID: ${id} not found`);
        throw new ResourceNotFoundException('Grocery');
      }
      this.logger.log(`Found grocery with ID: ${id}`);
      return grocery;
    } catch (error) {
      this.logger.customError('Failed to find grocery', error.stack);
      throw error;
    }
  }

  async update(
    id: number,
    updateGroceryDto: UpdateGroceryDto,
  ): Promise<Grocery> {
    try {
      const grocery = await this.groceriesRepository.findOne(id);
      if (!grocery) {
        this.logger.log(`Grocery with ID: ${id} not found`);
        throw new ResourceNotFoundException('Grocery');
      }
      this.logger.log(`Updating grocery with ID: ${id}`);
      return this.groceriesRepository.update(id, updateGroceryDto);
    } catch (error) {
      this.logger.customError('Failed to update grocery', error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<Grocery> {
    try {
      const grocery = await this.groceriesRepository.findOne(id);
      if (!grocery) {
        this.logger.log(`Grocery with ID: ${id} not found`);
        throw new ResourceNotFoundException('Grocery');
      }
      this.logger.log(`Removing grocery with ID: ${id}`);
      return this.groceriesRepository.remove(id);
    } catch (error) {
      this.logger.customError('Failed to remove grocery', error.stack);
      throw error;
    }
  }
  async validateGroceryName(name: string): Promise<ExistsResponseDto> {
    try {
      const isExists = await this.groceriesRepository.isGroceryNameExists(name);
      if (isExists) {
        this.logger.log(`Grocery name: ${name} already exists`);
        throw new ResourceAlreadyExistsException('Grocery');
      }
      this.logger.log(`Grocery name: ${name} is available`);
      return { isExists: false };
    } catch (error) {
      throw error;
    }
  }
}
