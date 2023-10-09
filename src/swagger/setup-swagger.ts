import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { RootConfig } from '@/config';

export function setupSwagger(app: INestApplication, config: RootConfig) {
  const documentBuilder = new DocumentBuilder().setTitle(config.app.name);

  if (config.app.description) {
    documentBuilder.setDescription(config.app.description);
  }

  if (config.app.version) {
    documentBuilder.setVersion(config.app.version);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
