import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { SetupService } from './setup/setup.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Pratice API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  const setupService = app.get(SetupService);
  const initialized = await setupService.isInitialized();

  if (!initialized) {
    console.log('\n⚠️  System not initialized yet.');
    console.log('   Please visit: http://localhost:3000/setup\n');
  }

  await app.listen(3000);
}
bootstrap();
