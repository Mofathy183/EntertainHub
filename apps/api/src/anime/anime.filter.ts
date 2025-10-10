import {
	Catch,
	ExceptionFilter,
	ArgumentsHost,
	HttpStatus,
	BadRequestException,
} from '@nestjs/common';
import {
	getAnimeErrorMessage,
	AnimeErrorCategory,
	AnimeErrorType,
} from './anime.utility';
import {
	BaseValidateResponse,
	BaseThrowError,
	TModules,
	ValidationExceptionResponse,
} from '../core/index';
import { Response } from 'express';

export class AnimeErrorResponse extends BaseValidateResponse {
	protected getExampleFor(field: string): string {
		switch (field) {
			case 'title':
				return '"Naruto"';
			case 'protagonist':
				return '"Naruto Uzumaki"';
			case 'universe':
				return '"Konoha"';
			default:
				return 'Provide a valid value';
		}
	}

	protected getDomainMessage(
		type: AnimeErrorType,
		category: AnimeErrorCategory,
	): string {
		return getAnimeErrorMessage(type, category);
	}
}

@Catch(BadRequestException)
export class AnimeValidationFilter implements ExceptionFilter {
	catch(exception: BadRequestException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status: number = HttpStatus.BAD_REQUEST;
		const exceptionResponse =
			exception.getResponse() as ValidationExceptionResponse;
		// ✅ Your ValidationError[]
		const validationErrors = exceptionResponse.errors ?? [];

		// Use your AnimeErrorResponse formatter
		const formatted = new AnimeErrorResponse(validationErrors).formatter();

		response.status(status).json(formatted);
	}
}

export class AnimeThrowError extends BaseThrowError<
	AnimeErrorType,
	AnimeErrorCategory
> {
	protected module: TModules = 'anime';

	protected getDomainMessage(
		type: AnimeErrorType,
		category: AnimeErrorCategory,
	): string {
		return getAnimeErrorMessage(type, category);
	}
}
