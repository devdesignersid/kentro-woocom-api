import type { Provider } from '@nestjs/common';

import { WOOCOMMERCE_SERVICE } from '../constants';
import { WooCommerceService } from '../services';

export const WooCommerceServiceProvider: Provider = {
  provide: WOOCOMMERCE_SERVICE,
  useClass: WooCommerceService,
};
