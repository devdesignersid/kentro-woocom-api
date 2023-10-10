import type { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { firstValueFrom } from 'rxjs';

import { genericRetryHandler } from '@/common/utils';

import type {
  IAuthenticateResponse,
  ICreateProduct,
  ICreateProductResponse,
  IGetProductsResponse,
  IKentroApiConfig,
  IValidateCredentialsResponse,
} from '../types';
import type { IKentroClient } from './kentro-client.interface';

/**
 * Represents a client for interacting with the Kentro API.
 */
export class KentroClient implements IKentroClient {
  private readonly httpService: HttpService;

  private readonly apiConfig: IKentroApiConfig;

  private readonly apiToken: string;

  /**
   * Creates a new instance of KentroClient.
   * @param {HttpService} httpService - The HTTP service instance for making API requests.
   * @param {IKentroApiConfig} config - The Kentro API configuration.
   * @param {string} token - The API access token.
   */
  private constructor(
    httpService: HttpService,
    config: IKentroApiConfig,
    token: string,
  ) {
    this.httpService = httpService;
    this.apiToken = token;
    this.apiConfig = config;
  }

  /**
   * Creates a new instance of KentroClient and performs authentication and credential validation.
   * @param {HttpService} httpService - The HTTP service instance for making API requests.
   * @param {IKentroApiConfig} config - The Kentro API configuration.
   * @returns {Promise<KentroClient>} A Promise resolving to a new instance of KentroClient.
   * @throws {InternalServerErrorException} If authentication with Kentro fails.
   */
  public static async new(httpService: HttpService, config: IKentroApiConfig) {
    try {
      // In ideal case we wouldn't need to call this method every time we instantiate the client.
      // Rather accessToken would be stored in the database corresponding to its user.
      const apiToken = await KentroClient.authenticate(httpService, config);
      await KentroClient.validateCredentials(httpService, config);

      return new KentroClient(httpService, config, apiToken);
    } catch (error) {
      if (
        error.response &&
        error.response.status === HttpStatusCode.Unauthorized
      ) {
        throw new InternalServerErrorException(
          'Authentication with Kentro failed!',
        );
      }
    }
  }

  /**
   * Performs authentication with the Kentro API and returns an access token.
   * @param {HttpService} httpService - The HTTP service instance for making API requests.
   * @param {IKentroApiConfig} config - The Kentro API configuration.
   * @returns {Promise<string>} A Promise resolving to the access token.
   */
  private static async authenticate(
    httpService: HttpService,
    config: IKentroApiConfig,
  ): Promise<string> {
    const response = await firstValueFrom(
      httpService.post<IAuthenticateResponse>(
        `${config.apiUrl}/${config.apiVersion}/authenticate`,
        {
          type: 'apiKey',
          key: config.apiKey,
          secret: config.apiSecret,
        },
      ),
    );

    return response.data.accessToken;
  }

  /**
   * Validates API credentials with the Kentro API.
   * @param {HttpService} httpService - The HTTP service instance for making API requests.
   * @param {IKentroApiConfig} config - The Kentro API configuration.
   * @returns {Promise<boolean>} A Promise resolving to true if credentials are valid, false otherwise.
   */
  private static async validateCredentials(
    httpService: HttpService,
    config: IKentroApiConfig,
  ): Promise<boolean> {
    const response = await firstValueFrom(
      httpService.post<IValidateCredentialsResponse>(
        `${config.apiUrl}/${config.apiVersion}/utils/check-api-credentials`,
        {
          key: config.apiKey,
          secret: config.apiSecret,
        },
      ),
    );

    return response.status === HttpStatusCode.Created;
  }

  /**
   * Retrieves products from Kentro for a specific channel.
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<IGetProductsResponse>} A Promise resolving to a list of products.
   */
  public async getProducts(channelId: string): Promise<IGetProductsResponse> {
    const response = await firstValueFrom(
      this.httpService
        .get<IGetProductsResponse>(
          `${this.apiConfig.apiUrl}/${this.apiConfig.apiVersion}/channel/product/list?$channel=${channelId}`,
          {
            headers: {
              Authorization: `Bearer ${this.apiToken}`,
            },
          },
        )
        .pipe(
          genericRetryHandler({
            maxRetryAttempts: 3,
            includedStatusCodes: [429],
          }),
        ),
    );

    return response.data;
  }

  /**
   * Creates new products in Kentro.
   * @param {ICreateProduct[]} createProductInput - An array of product data to create.
   * @returns {Promise<ICreateProductResponse>} A Promise resolving to a response containing the created product id.
   */
  public async createProduct(
    createProductInput: ICreateProduct[],
  ): Promise<ICreateProductResponse> {
    const response = await firstValueFrom(
      this.httpService
        .post<ICreateProductResponse>(
          `${this.apiConfig.apiUrl}/${this.apiConfig.apiVersion}/channel/product/create`,
          createProductInput,
          {
            headers: {
              Authorization: `Bearer ${this.apiToken}`,
            },
          },
        )
        .pipe(
          genericRetryHandler({
            maxRetryAttempts: 3,
            includedStatusCodes: [429],
          }),
        ),
    );

    return response.data;
  }
}
