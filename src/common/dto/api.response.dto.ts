import { ApiProperty, PartialType } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'The message of the response' })
  message: string;
}
export class IdResponseDto extends PartialType(MessageResponseDto) {
  @ApiProperty({ description: 'The ID of the created grocery item' })
  id: number;
}

export class ExistsResponseDto {
  @ApiProperty({ description: 'Indicates if the grocery name exists' })
  isExists: boolean;
}
