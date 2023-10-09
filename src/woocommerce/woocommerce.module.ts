import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WooCommerceServiceProvider } from './providers';

@Module({
  imports: [HttpModule],
  providers: [WooCommerceServiceProvider],
  exports: [WooCommerceServiceProvider],
})
export class WooCommerceModule {}
