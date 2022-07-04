import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
  path: path.join(__dirname, '..', 'config', `${process.env.NODE_ENV}.env`),
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/order');

  const config = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('The product API description')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'JWT auth',
        in: 'header',
        description: 'JWT token',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8081);
}
bootstrap();
