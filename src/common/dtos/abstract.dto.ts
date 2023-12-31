import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AbstractDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;
}
