import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { AppExceptionsFilter } from './app.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in DTO
      forbidNonWhitelisted: true, // throw error if unknown fields provided
      transform: true, // auto-transform payloads into DTO classes
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          message: 'Validation failed',
          errors, // 👈 attach the raw ValidationError[]
        });
      },
    }),
  );

  app.useGlobalFilters(new AppExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
