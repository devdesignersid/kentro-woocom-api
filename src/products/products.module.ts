import { Module } from '@nestjs/common';

import { KentroModule } from '@/kentro';
import { WooCommerceModule } from '@/woocommerce';

import { ProductsController } from './controllers';
import { ProductsServiceProvider } from './providers';

@Module({
  imports: [KentroModule, WooCommerceModule],
  controllers: [ProductsController],
  providers: [ProductsServiceProvider],
})
export class ProductsModule {}
