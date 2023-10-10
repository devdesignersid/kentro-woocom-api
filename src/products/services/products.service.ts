import { Inject, Injectable, Logger } from '@nestjs/common';

import { KentroConfig, WooCommerceConfig } from '@/config';
import { KENTRO_SERVICE } from '@/kentro/constants';
import { IKentroService } from '@/kentro/services';
import type { ICreateProduct, IGetProductsResponse } from '@/kentro/types';
import { ProductStatus, ProductType } from '@/kentro/types';
import { WOOCOMMERCE_SERVICE } from '@/woocommerce/constants';
import { IWooCommerceService } from '@/woocommerce/services';
import type { IGetAllProductsResponse, IProduct } from '@/woocommerce/types';

import type { IProductsService } from './products.service.interface';

@Injectable()
export class ProductsService implements IProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject(KENTRO_SERVICE)
    private readonly kentroService: IKentroService,
    @Inject(WOOCOMMERCE_SERVICE)
    private readonly wooCommerceService: IWooCommerceService,
    private readonly kentroConfig: KentroConfig,
    private readonly wooCommerceConfig: WooCommerceConfig,
  ) {}

  /**
   * Get the Kentro API client.
   * @returns {Promise<IKentroClient>} A Promise resolving to the Kentro API client.
   * @private
   */
  private async getKentroClient() {
    return this.kentroService.getClient(this.kentroConfig.getApiConfig());
  }

  /**
   * Get the WooCommerce API client.
   * @returns {Promise<IWooCommerceClient>} The WooCommerce API client.
   * @private
   */
  private getWooCommerceClient() {
    return this.wooCommerceService.getClient(
      this.wooCommerceConfig.getApiConfig(),
    );
  }

  /**
   * Fetch products from Kentro by channel ID.
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<IGetProductsResponse | undefined>} A Promise resolving to an array of products.
   */
  public async getProductsFromKentro(
    channelId: string,
  ): Promise<IGetProductsResponse | undefined> {
    try {
      const kentroClient = await this.getKentroClient();

      if (kentroClient) {
        return kentroClient.getProducts(channelId);
      }
    } catch (error) {
      this.logger.error(
        `Error fetching products from Kentro: ${error.message}`,
      );

      throw error;
    }
  }

  /**
   * Fetch products from WooCommerce.
   * @returns {Promise<IGetAllProductsResponse>} A Promise resolving to an array of products.
   */
  public async getProductsFromWooCommerce(): Promise<IGetAllProductsResponse> {
    try {
      const woocommerceClient = this.getWooCommerceClient();

      return woocommerceClient.getProducts();
    } catch (error) {
      this.logger.error(
        `Error fetching products from WooCommerce: ${error.message}`,
      );

      throw error;
    }
  }

  /**
   * Import products from WooCommerce to Kentro.
   * @param {string[]} productIds - An array of product IDs to import.
   * @param {string} channelId - The ID of the channel to import to.
   * @returns {Promise<string[]>} A Promise resolving to an array of imported product's ids.
   */
  public async importProductsFromWooCommerceToKentro(
    productIds: string[],
    channelId: string,
  ): Promise<string[]> {
    try {
      const woocommerceClient = this.getWooCommerceClient();
      const kentroClient = await this.getKentroClient();

      const importPromises = productIds.map(async (productId) => {
        const woocommerceProduct = await woocommerceClient.getAProduct(
          productId,
        );

        if (kentroClient) {
          const kentroProduct: ICreateProduct = {
            globalExternalId: woocommerceProduct.id,
            name: woocommerceProduct.name,
            productType: ProductType.STOCK,
            unitCost: Number.parseInt(woocommerceProduct.price, 10),
            // TODO: make it work with the original SKU when querying with globalExternalId is available
            SKU: `woocom-${woocommerceProduct.id}`,
            description: woocommerceProduct.description,
            isPublished: true,
            listToChannels: [{ id: channelId, isPublished: true }],
            listToAllChannelsAs: ProductStatus.PUBLISHED,
          };

          return kentroClient.createProduct([kentroProduct]);
        }
      });

      const importedProductResponses = await Promise.all(importPromises);

      return importedProductResponses
        .map((item) => item?.objectId)
        .filter(Boolean) as string[];
    } catch (error) {
      this.logger.error(`Error importing products: ${error.message}`);

      throw error;
    }
  }

  /**
   * Sync a WooCommerce product with Kentro.
   * @param {IProduct} body - The WooCommerce product to sync.
   * @returns {Promise<boolean>} A Promise resolving to `true` if the sync was successful, `false` otherwise.
   */
  public async syncWooCommerceProductWithKentro(
    body: IProduct,
  ): Promise<boolean> {
    try {
      const kentroClient = await this.getKentroClient();

      if (kentroClient) {
        const product = await kentroClient.getAProductBySKU(
          `woocom-${body.id}`,
          '64af5214bf8f0b216cbe105e',
        );

        /**
         * TODO: Add support for other properties as well.
         */
        await kentroClient.updateAProduct({
          name: body.name,
          description: body.description,
          productObjectId: product._id,
          productType: ProductType.STOCK,
        });
      }

      return true;
    } catch (error) {
      this.logger.error(`Error syncing products: ${error.message}`);

      return false;
    }
  }
}
