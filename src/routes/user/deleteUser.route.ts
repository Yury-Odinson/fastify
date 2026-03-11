import type { AuthenticatedApp } from "../../types/shared.js";
import { AppError } from "../../errors/appError.js";
import { toHttpError } from "../../errors/toHttpError.js";
import { userService } from "../../user/index.js";

export const deleteUserRoutes = async (app: AuthenticatedApp) => {
	app.delete("/api/user", { preHandler: app.authenticate }, async (request, reply) => {
		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await userService.deleteUser(userId);
			reply.clearCookie("refreshToken", {
				path: "/api/auth"
			});

			return { message: "User deleted successfully" };
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			console.error("Error in deleteUserRoute:", error);
			throw app.httpErrors.internalServerError("Failed to delete user");
		}
	});
};
