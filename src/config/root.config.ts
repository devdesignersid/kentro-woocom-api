import { Type } from 'class-transformer';
import { IsDefined, IsEnum, ValidateNested } from 'class-validator';

import { AppConfig } from './app.config';
import { KentroConfig } from './kentro.config';
import { Environment, LogLevel } from './types';
import { WooCommerceConfig } from './woocommerce.config';

export class RootConfig {
  @IsEnum(Environment)
  public readonly env: Environment;

  @IsEnum(LogLevel)
  public readonly log_level: LogLevel;

  @Type(() => AppConfig)
  @ValidateNested()
  @IsDefined()
  public readonly app: AppConfig;

  @Type(() => KentroConfig)
  @ValidateNested()
  @IsDefined()
  public readonly kentro: KentroConfig;

  @Type(() => WooCommerceConfig)
  @ValidateNested()
  @IsDefined()
  public readonly woocommerce: WooCommerceConfig;
}
