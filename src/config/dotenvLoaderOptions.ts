// eslint-disable-next-line unicorn/filename-case
import type { DotenvLoaderOptions } from 'nest-typed-config';

export const EnvLoaderOptions: DotenvLoaderOptions = {
  separator: '__',
  keyTransformer: (key: string) => key.toLowerCase(),
};
