import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
	TModules,
	getFunError,
	ROUTE_NOT_FOUND_ERROR,
	ROUTE_NOT_FOUND_MESSAGES,
} from './core.utility';

const getNotFoundRouteMessage = (module?: TModules) => {
	const routeMsgs = module ? ROUTE_NOT_FOUND_MESSAGES[module] : undefined;
	const errorMsgs = ROUTE_NOT_FOUND_ERROR[module ?? 'unknown'];

	const fallbackMsgs = [
		'404: Even the debugger couldn’t trace this path.',
		'This route drifted into the void of unhandled promises.',
		'Request failed successfully — route does not exist.',
		'The backend gods rolled a natural 1 on routing.',
		'This endpoint took a vacation without telling anyone.',
		'Your request fell into a black hole of “not found.”',
		'Server searched the archives — nothing but tumbleweeds.',
	];

	const pickRandom = <T>(arr: T[]): T =>
		arr[Math.floor(Math.random() * arr.length)];

	const selectedMsgs = routeMsgs?.length ? routeMsgs : fallbackMsgs;
	const selectedErrors = errorMsgs?.length
		? errorMsgs
		: ROUTE_NOT_FOUND_ERROR['unknown'];

	return {
		message: pickRandom(selectedMsgs),
		error: pickRandom(selectedErrors),
	};
};

const extractModuleFromUrl = (url: string): TModules => {
	const match = url.match(/entertainhub\/api\/([^/]+)/);
	const module = match?.[1] as TModules;
	return module;
};

@Injectable()
export class FallbackRouteMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		try {
			// if route exists, just continue
			if (res.headersSent) return next();

			const urlName = extractModuleFromUrl(req.originalUrl);

			const errorResponse = getFunError(
				urlName,
				'routes',
				HttpStatus.NOT_FOUND,
				getNotFoundRouteMessage(urlName),
			);

			res.status(HttpStatus.NOT_FOUND).json(errorResponse);
		} catch (error) {
			next(error); // ✅ forward to AppExceptionsFilter
		}
	}
}
