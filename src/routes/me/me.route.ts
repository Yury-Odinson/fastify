import { userService } from "../../user/index.js";
import type { AuthenticatedApp } from "../../types/shared.js";

export const meRoutes = (app: AuthenticatedApp) => {
	app.get("/api/me", { preHandler: app.authenticate }, async (request) => {
		if (!request.user) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		const { userId } = request.user as { userId: string };

		const userData = await userService.getUserById(Number(userId));

		if (!userData) {
			throw app.httpErrors.notFound("User not found");
		}

		return {
			name: userData.name,
			email: userData.email,
			lang: userData.lang,
		};
	});
};
