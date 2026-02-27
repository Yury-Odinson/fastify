import type { AuthenticatedApp } from "../../types/shared.js";
import { userService } from "../../user/index.js";
import { AppError } from "../../errors/appError.js";
import { toHttpError } from "../../errors/toHttpError.js";

export const newUserNameRoutes = async (app: AuthenticatedApp) => {
	app.post<{ Body: { newName: string } }>("/api/changeUserName", { preHandler: app.authenticate }, async (request, reply) => {
		const { newName } = request.body ?? {};

		if (!newName) {
			throw app.httpErrors.badRequest("Missing required field: newName");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await userService.changeUserName(userId, newName);
			return { message: "Name changed successfully" };
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			console.error("Error in changeUserNameRoute:", error);
			throw app.httpErrors.internalServerError("Failed to change name");
		}
	});

};
