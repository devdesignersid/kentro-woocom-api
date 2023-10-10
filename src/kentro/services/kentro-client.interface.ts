import type {
  ICreateProduct,
  ICreateProductResponse,
  IGetProductsResponse,
  IProduct,
  IUpdateProduct,
} from '../types';

export interface IKentroClient {
  getProducts(channelId: string): Promise<IGetProductsResponse>;
  createProduct(
    createProductInput: ICreateProduct[],
  ): Promise<ICreateProductResponse>;
  getAProductBySKU(sku: string, channelId: string): Promise<IProduct>;
  updateAProduct(updateProductInput: IUpdateProduct);
}
