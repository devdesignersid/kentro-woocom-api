export interface IWooCommerceApiConfig {
  apiUrl: string;
  consumerKey: string;
  consumerSecret: string;
  apiVersion: string;
}

export interface IGetAllProductsResponse {
  statusCode: number;
  data: IProduct[];
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string;
  date_on_sale_from_gmt: string;
  date_on_sale_to: string;
  date_on_sale_to_gmt: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: string[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity?: number;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number;
  sold_individually: boolean;
  weight: string;
  dimensions: IDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: string[];
  cross_sell_ids: string[];
  parent_id: number;
  purchase_note: string;
  categories: ICategory[];
  tags: string[];
  images: IImage[];
  attributes: IAttribute[];
  default_attributes: string[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  stock_status: string;
  has_options: boolean;
  post_password: string;
  _links: ILinks;
}

export interface IDimensions {
  length: string;
  width: string;
  height: string;
}

export interface ICategory {
  id: number;
  name: string;
  slug: string;
}

export interface IImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

export interface IAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface ILinks {
  self: ISelf[];
  collection: ICollection[];
}

export interface ISelf {
  href: string;
}

export interface ICollection {
  href: string;
}
