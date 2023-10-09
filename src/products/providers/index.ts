import type { Provider } from '@nestjs/common';

import { PRODUCTS_SERVICE } from '../constants';
import { ProductsService } from '../services';

export const ProductsServiceProvider: Provider = {
  provide: PRODUCTS_SERVICE,
  useClass: ProductsService,
};
