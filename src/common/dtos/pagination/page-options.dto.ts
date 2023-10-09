import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { ORDER, Order } from '../../constants';

export class PageOptionsDto {
  @ApiPropertyOptional()
  @IsEnum(ORDER)
  @IsOptional()
  readonly order?: Order = ORDER.ASC;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  readonly orderBy: string = 'createdAt';

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
