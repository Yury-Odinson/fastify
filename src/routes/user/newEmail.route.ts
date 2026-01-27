import type { AuthenticatedApp } from "../../types/shared.js";
import { userService } from "../../user/index.js";

export const newUserEmailRoutes = async (app: AuthenticatedApp) => {
	app.post<{ Body: { newEmail: string } }>("/api/changeUserEmail", { preHandler: app.authenticate }, async (request, reply) => {
		const { newEmail } = request.body ?? {};

		if (!newEmail) {
			throw app.httpErrors.badRequest("Missing required field: newEmail");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await userService.changeUserEmail(userId, newEmail);
			return { message: "Email changed successfully" };
		} catch (error) {
			console.error("Error in changeUserEmailRoute:", error);
			throw app.httpErrors.internalServerError("Failed to change email");
		}
	});

};
