import { ValidationError } from 'class-validator';
// import { TErrorCategory, TErrorType } from "./anime/anime.utility"
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

// interface DtoWithMeta {
//     constructor: {
//         meta?: {
//             type: TErrorType;
//             category: TErrorCategory;
//         };
//     };
// }

// export abstract class BaseErrorResponse {
//     protected abstract getDomainMessage(type: TErrorType, category: TErrorCategory): string
//     protected abstract getExampleFor(field: string): string

//     public type: TErrorType
//     public category: TErrorCategory

//     constructor(protected errors: ValidationError[]) {
//         this.type = 'create'
//         this.category = 'anime'
//         this.errors = errors
//     }

//     getValidateType(target: any): void{
//         const dto = target as DtoWithMeta;

//         const meta = dto?.constructor?.meta;

//         this.type = meta?.type as TErrorType
//         this.category = meta?.category as TErrorCategory
//     }

//     formatter() {
//         const format = this.errors.map(error => {
//             this.getValidateType(error.target)
//             return {
//                 field: error.property,
//                 errors: Object.values(error.constraints || {}),
//                 suggestion: `Fix the field "${error.property}". Example: ${this.getExampleFor(error.property)}`,
//             }
//         })

//         return {
//             message: this.getDomainMessage(this.type, this.category),
//             details: format,
//         }
//     }
// }

export interface ValidationExceptionResponse {
  message: string | string[];
  errors?: ValidationError[];
}

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse<Response>();
    const req: Request = ctx.getRequest<Request>();

    // let status: number;
    // let message: string | object;
    if (exception instanceof InternalServerErrorException) {
      console.log(exception.getResponse()); /**
             * {
                    message: 'Quote not updated. Even filler arcs have better continuity.',
                    error: 'Could not update quote. Looks like the script got rewritten.',
                    type: 'update',
                    category: 'quote',
                    timestamp: '2025-10-03T17:58:14.286Z'
            }
            { message: 'Internal Server Error', statusCode: 500 }
             */
      throw new InternalServerErrorException();
    }

    if (exception instanceof NotFoundException) {
      console.log('==================================NOT FOUND');
      console.log('Exception: RES', exception.getResponse());
      console.log('Exception: MES', exception.message);
    }
    // console.log("RES: ", res);
    // console.log("REQ: ", req);
  }
}

// export abstract class BaseThrowError {
//     protected abstract getDomainMessage(type: TErrorType, category: TErrorCategory): string

//     constructor(
//         protected error: unknown,
//         public type: TErrorType,
//         public category: TErrorCategory
//     ) {
//         this.type = type
//         this.category = category
//         this.error = error
//     }

//     throwError() {
//         // Helper: build error payload
//         const buildPayload = (errorMsg: string) => ({
//             message: this.getDomainMessage(this.type, this.category),
//             error: errorMsg,
//             type: this.type,
//             category: this.category,
//             timestamp: new Date().toISOString(),
//         });

//         // Mongoose invalid ID (e.g. bad ObjectId)
//         if (this.error instanceof mongoose.Error.CastError) {
//             throw new BadRequestException(buildPayload(this.error.message));
//         }

//         // Other mongoose errors (validation, duplicate key, etc.)
//         if (this.error instanceof mongoose.Error) {
//             throw new BadRequestException(buildPayload(this.error.message));
//         }

//         // Any standard error
//         if (this.error instanceof Error) {
//             throw new InternalServerErrorException(buildPayload(this.error.message));
//         }

//         // Fallback for primitives (string, number, null, etc.)
//         throw new InternalServerErrorException(buildPayload(String(this.error)));
//     }
// }
