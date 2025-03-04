import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ResourceAlreadyExistsException extends HttpException {
  constructor(resource: string) {
    super(`${resource} already exists`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidDataException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}

export class InsufficientStockException extends HttpException {
  constructor(groceryName: string) {
    super(
      `Insufficient stock for grocery item ${groceryName}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
