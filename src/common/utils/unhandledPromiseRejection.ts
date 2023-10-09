import { Logger } from '@nestjs/common';

const logger = new Logger('UnhandledPromiseRejection');

export function configureUnhandledPromiseRejectionHandler() {
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', reason);
  });
}
