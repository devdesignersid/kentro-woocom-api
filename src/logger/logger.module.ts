import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { ConfigModule, RootConfig } from '@/config';

export const LoggerModule = PinoLoggerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [RootConfig],
  useFactory: (config: RootConfig) => ({
    pinoHttp: {
      customProps: () => ({ context: 'HTTP' }),
      level: config.log_level,
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
        },
      },
    },
  }),
});
