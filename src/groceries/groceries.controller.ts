import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GroceriesService } from './groceries.service';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExistsResponseDto, IdResponseDto } from './dto/response.dto';
import { ExampleResponses } from './responses/example-responses';
import { ROUTES } from '../constants/app.constants';

@ApiTags(ROUTES.GROCERIES)
@Controller(ROUTES.GROCERIES)
export class GroceriesController {
  constructor(private readonly groceriesService: GroceriesService) {}
  @Get('validate-grocery-name')
  @ApiResponse({
    status: 200,
    description: 'Grocery name is valid',
    schema: {
      example: ExampleResponses.validateGroceryNameSuccess,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Grocery name already exists',
    schema: {
      example: ExampleResponses.validateGroceryNameError,
    },
  })
  @ApiResponse({ status: 400, description: 'Grocery name already exists' })
  validateGroceryName(@Query('name') name: string): Promise<ExistsResponseDto> {
    return this.groceriesService.validateGroceryName(name);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Grocery created successfully',
    schema: {
      example: ExampleResponses.createGrocerySuccess,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Grocery name already exists',
    schema: {
      example: ExampleResponses.validateGroceryNameError,
    },
  })
  create(@Body() createGroceryDto: CreateGroceryDto): Promise<IdResponseDto> {
    return this.groceriesService.create(createGroceryDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Grocery list retrieved successfully',
    schema: {
      example: ExampleResponses.findAllSuccess,
    },
  })
  findAll() {
    return this.groceriesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Grocery retrieved successfully',
    schema: {
      example: ExampleResponses.findOneSuccess,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Grocery not found',
    schema: {
      example: ExampleResponses.findOneError,
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groceriesService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Grocery updated successfully',
    schema: {
      example: ExampleResponses.updateGrocerySuccess,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Grocery not found',
    schema: {
      example: ExampleResponses.findOneError,
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroceryDto: UpdateGroceryDto,
  ) {
    return this.groceriesService.update(id, updateGroceryDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Grocery deleted successfully',
    schema: {
      example: ExampleResponses.deleteGrocerySuccess,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Grocery not found',
    schema: {
      example: ExampleResponses.findOneError,
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groceriesService.remove(id);
  }
}
