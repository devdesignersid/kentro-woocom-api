import type { Provider } from '@nestjs/common';

import { KENTRO_SERVICE } from '../constants';
import { KentroService } from '../services';

export const KentroServiceProvider: Provider = {
  provide: KENTRO_SERVICE,
  useClass: KentroService,
};
