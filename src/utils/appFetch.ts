/* eslint-disable unicorn/filename-case */
import Box from 'cli-box';

import type { RootConfig } from '@/config';

export function appFetch(config: RootConfig): void {
  const { app } = config;
  // eslint-disable-next-line no-console
  console.log(
    Box(
      '20x10',
      `
                     \u001B[31m${app.name}\u001B[0m
                     \u001B[34m Version: \u001B[0m${app.version}
                     \u001B[34mPort: \u001B[0m${app.port}
                     \u001B[34mHost: \u001B[0m${app.host}`,
    ),
  );
}
