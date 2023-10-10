import type { IProduct } from '@/woocommerce/types';

export interface IProductsService {
  getProductsFromKentro(channelId: string);
  getProductsFromWooCommerce();
  importProductsFromWooCommerceToKentro(productId: string[], channelId: string);
  syncWooCommerceProductWithKentro(body: IProduct);
}
