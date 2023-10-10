import type { HttpService } from '@nestjs/axios';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import crypto from 'crypto';
import type { RequestOptions } from 'oauth-1.0a';
import OAuth from 'oauth-1.0a';
import { firstValueFrom } from 'rxjs';

import { genericRetryHandler } from '@/common/utils';

import type {
  IGetAllProductsResponse,
  IProduct,
  IWooCommerceApiConfig,
} from '../types';
import type { IWooCommerceClient } from './woocommerce-client.interface';

/**
 * Represents a client for interacting with the WooCommerce API.
 */
export class WooCommerceClient implements IWooCommerceClient {
  private readonly httpService: HttpService;

  private readonly apiConfig: IWooCommerceApiConfig;

  /**
   * Creates a new instance of WooCommerceClient.
   * @param {HttpService} httpService - The HTTP service instance for making API requests.
   * @param {IWooCommerceApiConfig} config - The WooCommerce API configuration.
   */
  private constructor(httpService: HttpService, config: IWooCommerceApiConfig) {
    this.httpService = httpService;
    this.apiConfig = config;
  }

  /**
   * Creates a new instance of WooCommerceClient.
   * @param {HttpService} httpService - The HTTP service instance for making API requests.
   * @param {IWooCommerceApiConfig} config - The WooCommerce API configuration.
   * @returns {WooCommerceClient} An instance of WooCommerceClient.
   */
  public static new(httpService: HttpService, config: IWooCommerceApiConfig) {
    return new WooCommerceClient(httpService, config);
  }

  /**
   * Generates the OAuth1.0a authorization header for the API request.
   * @param {RequestOptions} request - The request options.
   * @returns {object} The OAuth1.0a authorization header.
   * @private
   */
  private getAuthHeaderForRequest(request: RequestOptions) {
    const oauth = new OAuth({
      consumer: {
        key: this.apiConfig.consumerKey,
        secret: this.apiConfig.consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });
    const authorization = oauth.authorize(request);

    return oauth.toHeader(authorization);
  }

  /**
   * Retrieves all products from WooCommerce.
   * @returns {Promise<IGetAllProductsResponse>} A Promise resolving to a list of products.
   */
  public async getProducts(): Promise<IGetAllProductsResponse> {
    const request: RequestOptions = {
      url: `${this.apiConfig.apiUrl}/wp-json/wc/${this.apiConfig.apiVersion}/products`,
      method: 'GET',
    };
    const authHeader = this.getAuthHeaderForRequest(request);

    const response = await firstValueFrom(
      this.httpService.get<IGetAllProductsResponse>(request.url, {
        headers: { ...authHeader },
      }),
    );

    return response.data;
  }

  /**
   * Retrieves a single product from WooCommerce by ID.
   * @param {string} id - The ID of the product to retrieve.
   * @returns {Promise<IProduct>} A Promise resolving to the product.
   * @throws {NotFoundException} If the product with the specified ID is not found.
   * @throws {InternalServerErrorException} If an internal server error occurs.
   */
  public async getAProduct(id: string): Promise<IProduct> {
    try {
      const request: RequestOptions = {
        url: `${this.apiConfig.apiUrl}/wp-json/wc/${this.apiConfig.apiVersion}/products/${id}`,
        method: 'GET',
      };
      const authHeader = this.getAuthHeaderForRequest(request);

      const response = await firstValueFrom(
        this.httpService
          .get<IProduct>(request.url, {
            headers: { ...authHeader },
          })
          .pipe(
            genericRetryHandler({
              maxRetryAttempts: 3,
              includedStatusCodes: [429],
            }),
          ),
      );

      return response.data;
    } catch (error) {
      if (error?.response.status === HttpStatusCode.NotFound) {
        throw new NotFoundException(`Product with id ${id} not found!`);
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
