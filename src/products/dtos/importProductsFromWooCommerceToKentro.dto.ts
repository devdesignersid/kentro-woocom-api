import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ImportProductFromWooCommerceToKentroDto {
  @ApiProperty({
    description: 'An array of product IDs to import',
    example: ['product1', 'product2'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  productIds: string[];

  @ApiProperty({
    description: 'The ID of the channel to import to',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  channelId: string;
}
