import { AppError } from "./appError.js";

type AppWithHttpErrors = {
	httpErrors: {
		badRequest: (message: string) => Error;
		unauthorized: (message: string) => Error;
		forbidden: (message: string) => Error;
		notFound: (message: string) => Error;
		conflict: (message: string) => Error;
		unprocessableEntity: (message: string) => Error;
		internalServerError: (message: string) => Error;
	};
};

export const toHttpError = (app: AppWithHttpErrors, error: AppError): Error => {
	switch (error.statusCode) {
		case 400:
			return app.httpErrors.badRequest(error.message);
		case 401:
			return app.httpErrors.unauthorized(error.message);
		case 403:
			return app.httpErrors.forbidden(error.message);
		case 404:
			return app.httpErrors.notFound(error.message);
		case 409:
			return app.httpErrors.conflict(error.message);
		case 422:
			return app.httpErrors.unprocessableEntity(error.message);
		default:
			return app.httpErrors.internalServerError(error.message);
	}
};
