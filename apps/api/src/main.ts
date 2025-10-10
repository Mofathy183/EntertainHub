import { NestFactory } from '@nestjs/core';
import {
	ValidationPipe,
	ValidationError,
	BadRequestException,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { AppExceptionsFilter, FallbackRouteMiddleware } from './core/index';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('entertainhub/api');

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

	//* Wait until routes are set up, then start listening
	await app.listen(process.env.PORT ?? 3000);

	//* Now attach your fallback middleware
	app.getHttpAdapter().getInstance();

	//* add the Global middleware here to apply it in all the app
	app.use((req: Request, res: Response, next: NextFunction) =>
		new FallbackRouteMiddleware().use(req, res, next),
	);

	console.log(
		`Application is running on: http://localhost:${process.env.PORT ?? 3000}/entertainhub/api/`,
	);
}

bootstrap().catch((err) => {
	console.error('Error during application bootstrap:', err);
	process.exit(1);
});
