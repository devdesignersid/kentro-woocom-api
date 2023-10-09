import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetProductsFromKentroDto {
  @ApiProperty({
    description: 'The ID of the channel for which to fetch products',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  channelId: string;
}
