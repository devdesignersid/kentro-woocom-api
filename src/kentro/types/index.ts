export interface IKentroApiConfig {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
  apiVersion: string;
}

export interface IValidateCredentialsResponse {
  result: boolean;
  key: string;
  adminDomain: string;
}

export interface IAuthenticateResponse {
  accessToken: string;
  user: {
    _id: string;
  };
}

export interface IGetProductsResponse {
  total: number;
  limit: number;
  skip: number;
  data: IProduct[];
}

export interface IProduct {
  isPublished: boolean;
  isVariant: boolean;
  attributes: unknown[];
  images: IImage[];
  inventory: IInventory;
  products: IProduct[];
  organization: IOrganization;
  currency: string;
  compareAtPrice: number;
  leadTime: number;
  unitPrice: number;
  affiliateUrl: string;
  listingType: string;
  type: string;
  description: string;
  shortDescription: string;
  attributeSchema: string;
  name: string;
  SKU: string;
  barcode: string;
  groupId: string;
  globalExternalId: string;
  id: string;
  _id: string;
}

export interface IImage {
  type: string;
  alt: string;
  url: string;
}

export interface IInventory {
  stockLevel: string;
  maxItemsPerOrder: number;
  minItemsPerOrder: number;
}

export interface IOrganization {
  tags: string[];
  categories: string[];
  vendors: string[];
  brands: string[];
}

/**
 * TODO: Add support for other fields
 */
export interface ICreateProduct {
  globalExternalId: string;
  name: string;
  SKU: string;
  productType: ProductType;
  barcode?: string;
  description?: string;
  shortDescription?: string;
  unitCost: number;
  isPublished: boolean;
  listToAllChannelsAs: ProductStatus;
  listToChannels: IListToChannel[];
}

/**
 * TODO: Add support for other fields
 */
export interface IUpdateProduct {
  productObjectId: string;
  name?: string;
  SKU?: string;
  productType: ProductType;
  barcode?: string;
  description?: string;
  shortDescription?: string;
  unitCost?: number;
  isPublished?: boolean;
  listToAllChannelsAs?: ProductStatus;
  listToChannels?: IListToChannel[];
}

export interface IListToChannel {
  isPublished: boolean;
  id: string;
}

export enum ProductStatus {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

export enum ProductType {
  STOCK = 'stock',
  VIRTUAL = 'virtual',
  MATERIAL = 'material',
}

export interface ICreateProductResponse {
  objectId: string;
  status: 'created';
}

export interface IUpdateProductResponse {
  objectId: string;
  status: 'updated';
}
