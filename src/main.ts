import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { dynamicImport } from './dynamic';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
          transform: true,
          whitelist: true,
      }),
  );

  const adminJSModule = await dynamicImport('adminjs');
  const AdminJS = adminJSModule.default;

  const AdminJSTypeOrm = await dynamicImport('@adminjs/typeorm');

  AdminJS.registerAdapter({
      Resource: AdminJSTypeOrm.Resource,
      Database: AdminJSTypeOrm.Database,
  });

  await app.listen(3000);
}
bootstrap();
