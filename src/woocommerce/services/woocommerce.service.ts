import type { HttpService } from '@nestjs/axios';

import type { IWooCommerceApiConfig } from '../types';
import type { IWooCommerceClient } from './woocommerce-client.interface';

export interface IWooCommerceService {
  getClient(config: IWooCommerceApiConfig): IWooCommerceClient;
}
