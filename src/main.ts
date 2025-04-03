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
    .setTitle('Your API title')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('YourTagName')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Listen on the port specified by the configuration service
  await app.listen(port);
}
bootstrap();
