import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import type { IWooCommerceApiConfig } from '../types';
import type { IWooCommerceService } from './woocommerce.service';
import { WooCommerceClient } from './woocommerce-client';
import type { IWooCommerceClient } from './woocommerce-client.interface';

@Injectable()
export class WooCommerceService implements IWooCommerceService {
  constructor(private readonly httpService: HttpService) {}

  public getClient(config: IWooCommerceApiConfig): IWooCommerceClient {
    return WooCommerceClient.new(this.httpService, config);
  }
}
