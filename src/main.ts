import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*'
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  const port = process.env.PORT || 3001
    
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap()