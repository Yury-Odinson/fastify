import type { AuthenticatedApp } from "../../types/shared.js";
import { AppError } from "../../errors/appError.js";
import { toHttpError } from "../../errors/toHttpError.js";
import { userService } from "../../user/index.js";
import { isValidEmail } from "../../utils/validations.js";

export const newUserEmailRoutes = async (app: AuthenticatedApp) => {
	app.post<{ Body: { newEmail: string } }>("/api/changeUserEmail", { preHandler: app.authenticate }, async (request, reply) => {
		const { newEmail } = request.body ?? {};

		if (!newEmail) {
			throw app.httpErrors.badRequest("Missing required field: newEmail");
		}

		const normalizedEmail = newEmail.toLowerCase().trim();
		if (!isValidEmail(normalizedEmail)) {
			throw app.httpErrors.badRequest("Invalid email format");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await userService.changeUserEmail(userId, normalizedEmail);
			return { message: "Email changed successfully" };
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			console.error("Error in changeUserEmailRoute:", error);
			throw app.httpErrors.internalServerError("Failed to change email");
		}
	});

};
