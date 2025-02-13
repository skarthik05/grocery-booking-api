import { ApiProperty } from '@nestjs/swagger';

export class IdResponseDto {
  @ApiProperty({ description: 'The ID of the created grocery item' })
  id: number;
}
