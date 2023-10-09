import type { IGetAllProductsResponse, IProduct } from '../types';

export interface IWooCommerceClient {
  getProducts(): Promise<IGetAllProductsResponse>;
  getAProduct(id: string): Promise<IProduct>;
}
