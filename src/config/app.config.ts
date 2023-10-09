import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AppConfig {
  @IsString()
  public readonly host!: string;

  @IsNumber()
  public readonly port!: number;

  @IsString()
  public readonly version!: string;

  @IsString()
  public readonly name!: string;

  @IsString()
  @IsOptional()
  public readonly description?: string;
}
