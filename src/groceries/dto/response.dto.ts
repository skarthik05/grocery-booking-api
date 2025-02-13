import { ApiProperty } from '@nestjs/swagger';

export class ExistsResponseDto {
  @ApiProperty({ description: 'Indicates if the grocery name exists' })
  isExists: boolean;
}
