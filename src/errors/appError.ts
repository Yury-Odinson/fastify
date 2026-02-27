export type AppErrorCode = string;

export class AppError extends Error {
	constructor(
		public readonly code: AppErrorCode,
		message: string,
		public readonly statusCode: number = 500
	) {
		super(message);
		this.name = "AppError";
	}
}
