// config.module.ts
import { dotenvLoader, TypedConfigModule } from 'nest-typed-config';

import { EnvLoaderOptions } from './dotenvLoaderOptions';
import { RootConfig } from './root.config';
import { normalize } from './utils';

export const ConfigModule = TypedConfigModule.forRoot({
  schema: RootConfig,
  load: dotenvLoader(EnvLoaderOptions),
  normalize,
});
