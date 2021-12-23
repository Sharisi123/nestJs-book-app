import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, { cors: true });

  // app.enableCors();
  // app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Book app')
    .setDescription('this is the api documentation about my app')
    .setVersion('1.0')
    .addTag('authors')
    .addTag('books')
    .addTag('chats')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`server starts on port http://localhost:${PORT}`);
  });
}
bootstrap();
