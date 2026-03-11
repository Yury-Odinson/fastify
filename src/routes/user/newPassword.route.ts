import type { AuthenticatedApp } from "../../types/shared.js";
import { userService } from "../../user/index.js";
import { AppError } from "../../errors/appError.js";
import { toHttpError } from "../../errors/toHttpError.js";
import { isValidPassword } from "../../utils/validations.js";

export const newUserPasswordRoutes = async (app: AuthenticatedApp) => {
	app.post<{ Body: { newPassword: string } }>("/api/changeUserPassword", { preHandler: app.authenticate }, async (request, reply) => {
		const { newPassword } = request.body ?? {};

		if (!newPassword) {
			throw app.httpErrors.badRequest("Missing required field: newPassword");
		}

		if (!isValidPassword(newPassword)) {
			throw app.httpErrors.badRequest("Password must be at least 8 characters");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await userService.changeUserPassword(userId, newPassword);
			return { message: "Password changed successfully" };
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			console.error("Error in newPasswordRoute:", error);
			throw app.httpErrors.internalServerError("Failed to change password");
		}
	});

};
