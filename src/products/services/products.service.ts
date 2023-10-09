import { Inject, Injectable, Logger } from '@nestjs/common';

import { KentroConfig, WooCommerceConfig } from '@/config';
import { KENTRO_SERVICE } from '@/kentro/constants';
import { IKentroService } from '@/kentro/services';
import type { IGetProductsResponse } from '@/kentro/types';
import { ProductStatus, ProductType } from '@/kentro/types';
import { WOOCOMMERCE_SERVICE } from '@/woocommerce/constants';
import { IWooCommerceService } from '@/woocommerce/services';
import type { IGetAllProductsResponse } from '@/woocommerce/types';

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
  ) {
    try {
      const woocommerceClient = this.getWooCommerceClient();
      const kentroClient = await this.getKentroClient();

      const importPromises = productIds.map(async (productId) => {
        const woocommerceProduct = await woocommerceClient.getAProduct(
          productId,
        );

        if (kentroClient) {
          const kentroProduct = {
            globalExternalId: woocommerceProduct.id,
            name: woocommerceProduct.name,
            productType: ProductType.STOCK,
            unitCost: Number.parseInt(woocommerceProduct.price, 10),
            SKU: woocommerceProduct.sku,
            description: woocommerceProduct.description,
            isPublished: true,
            listToChannels: [{ id: channelId, isPublished: true }],
            listToAllChannelsAs: ProductStatus.PUBLISHED,
          };

          return kentroClient.createProduct([kentroProduct]);
        }
      });

      const importedProductResponses = await Promise.all(importPromises);

      return importedProductResponses.map((item) => item?.objectId);
    } catch (error) {
      this.logger.error(`Error importing products: ${error.message}`);

      throw error;
    }
  }
}
