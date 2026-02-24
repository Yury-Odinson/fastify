import { userService } from "../../user/index.js";
import type { AuthenticatedApp } from "../../types/shared.js";

export const meRoutes = (app: AuthenticatedApp) => {
	app.get("/api/me", { preHandler: app.authenticate }, async (request) => {
		if (!request.user) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		const { userId } = request.user as { userId: string };
		const userData = await userService.getUserWithRecentMoods(Number(userId), 5);
		if (!userData?.user) {
			throw app.httpErrors.notFound("User not found");
		}

		return {
			name: userData.user.name,
			email: userData.user.email,
			lang: userData.user.lang,
			recentMoods: userData.recentMoods,
		};
	});
};
