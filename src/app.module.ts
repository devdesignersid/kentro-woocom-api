import { Module } from '@nestjs/common';

import { ConfigModule } from '@/config';
import { HealthCheckerModule } from '@/health-checker';
import { KentroModule } from '@/kentro';
import { LoggerModule } from '@/logger';
import { ProductsModule } from '@/products';
import { WooCommerceModule } from '@/woocommerce';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    HealthCheckerModule,
    KentroModule,
    WooCommerceModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
