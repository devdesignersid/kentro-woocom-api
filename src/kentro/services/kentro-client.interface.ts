import type {
  ICreateProduct,
  ICreateProductResponse,
  IGetProductsResponse,
} from '../types';

export interface IKentroClient {
  getProducts(channelId: string): Promise<IGetProductsResponse>;
  createProduct(
    createProductInput: ICreateProduct[],
  ): Promise<ICreateProductResponse>;
}
