import { ValidationError } from 'class-validator';
import { AnimeErrorCategory, AnimeErrorType } from '../anime/anime.utility';
import {
	TValidationDetails,
	IValidationResponse,
	IThrowError,
	TModules,
	TFilterErrorKeys,
	getFunError,
} from './core.utility';
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
	BadRequestException,
	UnauthorizedException,
	ForbiddenException,
	ConflictException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Response } from 'express';

interface DtoWithMeta {
	constructor: {
		meta?: {
			type: AnimeErrorType;
			category: AnimeErrorCategory;
		};
	};
}

export abstract class BaseValidateResponse {
	protected abstract getDomainMessage(
		type: AnimeErrorType,
		category: AnimeErrorCategory,
	): string;
	protected abstract getExampleFor(field: string): string;

	public type: AnimeErrorType;
	public category: AnimeErrorCategory;

	constructor(protected errors: ValidationError[]) {
		this.type = 'create';
		this.category = 'anime';
		this.errors = errors;
	}

	getValidateType(target: any): void {
		const dto = target as DtoWithMeta;

		const meta = dto?.constructor?.meta;

		this.type = meta?.type as AnimeErrorType;
		this.category = meta?.category as AnimeErrorCategory;
	}

	formatter(): IValidationResponse {
		const format: TValidationDetails[] = this.errors.map((error) => {
			this.getValidateType(error.target);
			return {
				field: error.property,
				errors: Object.values(error.constraints || {}),
				suggestion: `Fix the field "${error.property}". Example: ${this.getExampleFor(error.property)}`,
			};
		});

		return {
			message: this.getDomainMessage(this.type, this.category),
			details: format,
		};
	}
}

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res: Response = ctx.getResponse<Response>();

		const status: number =
			exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

		const rawResponse = exception.getResponse();

		const throwErrorResponse: Partial<IThrowError> =
			typeof rawResponse === 'object' && rawResponse !== null
				? (rawResponse as Partial<IThrowError>)
				: { message: String(rawResponse) };

		const moduleKey = throwErrorResponse.module as TModules;
		const errorTypeKey = throwErrorResponse.errorType as TFilterErrorKeys;

		const errorResponse = getFunError(
			moduleKey,
			errorTypeKey,
			status,
			throwErrorResponse,
		);

		// Optional: log structured error (for dev/debug)
		console.error(`[AppExceptionsFilter]`, {
			error: errorResponse.error,
			status,
			moduleKey,
			errorTypeKey,
			message: errorResponse.message,
		});

		return res.status(status).json(errorResponse);
	}
}

export abstract class BaseThrowError<
	TType extends string,
	TCategory extends string,
> {
	protected abstract getDomainMessage(
		type: TType,
		category: TCategory,
	): string;
	protected abstract module: TModules;

	constructor(
		protected type: TType,
		protected category: TCategory,
		public errorType: TFilterErrorKeys,
		protected error?: unknown,
	) {
		this.type = type;
		this.category = category;
		this.error = error;
		this.errorType = errorType;
	}

	getHttpException(payload: IThrowError): HttpException {
		const httpErrorsExceptions: Record<TFilterErrorKeys, HttpException> = {
			routes: new NotFoundException(payload),
			notFound: new NotFoundException(payload),
			unknown: new InternalServerErrorException(payload),
			InternalServer: new InternalServerErrorException(payload),
			unauthorized: new UnauthorizedException(payload),
			forbidden: new ForbiddenException(payload),
			conflict: new ConflictException(payload),
		};

		return httpErrorsExceptions[this.errorType];
	}

	throwError() {
		// Helper: build error payload
		const buildPayload = (errorMsg: string): IThrowError => ({
			message: this.getDomainMessage(this.type, this.category),
			error: errorMsg,
			errorType: this.errorType,
			module: this.module,
			timestamp: new Date(),
		});

		let errorMessage: string = 'Unexpected error occurred';

		// Mongoose invalid ID (e.g. bad ObjectId)
		if (this.error instanceof mongoose.Error.CastError) {
			errorMessage = `Invalid ID format: ${this.error.message}`;
			throw new BadRequestException(buildPayload(errorMessage));
		}

		// Duplicate key error (MongoServerError)
		if (
			this.error instanceof mongoose.mongo.MongoServerError &&
			this.error.code === 11000
		) {
			const duplicateField =
				Object.keys(this.error ?? {}).join(', ') || 'field';
			errorMessage = `Duplicate value for ${duplicateField}`;
			throw new ConflictException(buildPayload(errorMessage));
		}

		// Other mongoose errors (validation, duplicate key, etc.)
		if (this.error instanceof mongoose.Error) {
			errorMessage = `Validation failed: ${this.error.message}`;
			throw new BadRequestException(buildPayload(errorMessage));
		}

		// Any standard error
		if (this.error instanceof Error) {
			errorMessage = this.error.message;
		} else if (typeof this.error === 'string') {
			errorMessage = this.error;
		}

		// Fallback for primitives (string, number, null, etc.)
		throw this.getHttpException(buildPayload(errorMessage));
	}
}
