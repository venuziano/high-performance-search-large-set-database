import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppEnvConfigService } from './config/environment-variables/app-env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Retrieve the configuration service instance
  const configService = app.get(AppEnvConfigService);

  // Use the configuration service to get the port
  const port = configService.apiPort;

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('High performance search in large database sets')
    .setDescription('The idea of this repository is to solve a common real use case when users need to search for a specific search term in large database sets.')
    .setVersion('1.0')
    .addTag('YourTagName')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Listen on the port specified by the configuration service
  await app.listen(port);
}
bootstrap();
