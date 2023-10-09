import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PRODUCTS_SERVICE } from '../constants';
import {
  GetProductsFromKentroDto,
  ImportProductFromWooCommerceToKentroDto,
} from '../dtos';
import { IProductsService } from '../services';

@Controller({ path: 'products', version: '1' })
@ApiTags('Products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE)
    private readonly productsService: IProductsService,
  ) {}

  @Get('/kentro/')
  @ApiOperation({ summary: 'Get products from Kentro' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiQuery({ name: 'channelId', type: Number, required: true })
  public getProductsFromKentro(
    @Query() getProductsFromKentroDto: GetProductsFromKentroDto,
  ) {
    const { channelId } = getProductsFromKentroDto;

    return this.productsService.getProductsFromKentro(channelId);
  }

  @Get('/woocommerce')
  @ApiOperation({ summary: 'Get products from WooCommerce' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  public getProductsFromWooCommerce() {
    return this.productsService.getProductsFromWooCommerce();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Post('/woocommerce/import')
  @ApiOperation({ summary: 'Import products from WooCommerce to Kentro' })
  @ApiResponse({ status: 200, description: 'Product import started' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Product already exists',
  })
  public async importProductsFromWooCommerceToKentro(
    @Body() dto: ImportProductFromWooCommerceToKentroDto,
  ) {
    const { productIds, channelId } = dto;

    this.productsService.importProductsFromWooCommerceToKentro(
      productIds,
      channelId,
    );

    return { message: 'Product import process started' };
  }
}
