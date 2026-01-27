import type { AuthenticatedApp } from "../../types/shared.js";
import { userService } from "../../user/index.js";

export const newUserPasswordRoutes = async (app: AuthenticatedApp) => {
	app.post<{ Body: { newPassword: string } }>("/api/changeUserPassword", { preHandler: app.authenticate }, async (request, reply) => {
		const { newPassword } = request.body ?? {};

		if (!newPassword) {
			throw app.httpErrors.badRequest("Missing required field: newPassword");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await userService.changeUserPassword(userId, newPassword);
			return { message: "Password changed successfully" };
		} catch (error) {
			console.error("Error in newPasswordRoute:", error);
			throw app.httpErrors.internalServerError("Failed to change password");
		}
	});

};
