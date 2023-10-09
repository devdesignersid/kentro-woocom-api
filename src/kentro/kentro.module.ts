import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { KentroServiceProvider } from './providers';

@Module({
  imports: [HttpModule],
  providers: [KentroServiceProvider],
  exports: [KentroServiceProvider],
})
export class KentroModule {}
