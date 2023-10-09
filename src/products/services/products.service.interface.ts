export interface IProductsService {
  getProductsFromKentro(channelId: string);
  getProductsFromWooCommerce();
  importProductsFromWooCommerceToKentro(productId: string[], channelId: string);
}
