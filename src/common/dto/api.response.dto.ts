import { ApiProperty } from '@nestjs/swagger';

export class IdResponseDto {
  @ApiProperty({ description: 'The ID of the created grocery item' })
  id: number;
}

export class ExistsResponseDto {
  @ApiProperty({ description: 'Indicates if the grocery name exists' })
  isExists: boolean;
}
